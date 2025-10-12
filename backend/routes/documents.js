const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf').split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - documentType
 *               - relatedId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               documentType:
 *                 type: string
 *                 enum: [aadhaar, pan, voter_id, caste_certificate, bank_passbook, case_documents, income_certificate, disability_certificate, other]
 *               relatedId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error
 */
router.post('/upload', [
  authMiddleware,
  upload.single('file'),
  body('documentType').isIn(['aadhaar', 'pan', 'voter_id', 'caste_certificate', 'bank_passbook', 'case_documents', 'income_certificate', 'disability_certificate', 'other']).withMessage('Valid document type is required'),
  body('relatedId').notEmpty().withMessage('Related ID is required'),
  body('description').optional().isString().withMessage('Description must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    if (!req.file) {
      return ResponseFormatter.error(res, 'No file uploaded', 400);
    }

    const documentData = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentType: req.body.documentType,
      relatedId: req.body.relatedId,
      description: req.body.description,
      uploadedBy: req.user.id,
      uploadedAt: new Date()
    };

    logger.info(`Document uploaded: ${req.file.originalname} by user: ${req.user.email}`);

    ResponseFormatter.success(res, documentData, 'Document uploaded successfully', 201);
  } catch (error) {
    logger.error('Document upload error:', error);
    ResponseFormatter.error(res, 'Document upload failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Download document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document downloaded successfully
 *       404:
 *         description: Document not found
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // In a real implementation, you would store document metadata in database
    // and retrieve the file path based on the ID
    const documentPath = req.params.id; // This should be retrieved from database
    
    if (!fs.existsSync(documentPath)) {
      return ResponseFormatter.notFound(res, 'Document not found');
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(documentPath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(documentPath);
    fileStream.pipe(res);

    logger.info(`Document downloaded: ${path.basename(documentPath)} by user: ${req.user.email}`);
  } catch (error) {
    logger.error('Document download error:', error);
    ResponseFormatter.error(res, 'Document download failed', 500, error.message);
  }
});

module.exports = router;
