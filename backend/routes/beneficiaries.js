const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Beneficiary = require('../models/Beneficiary');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/beneficiaries:
 *   post:
 *     summary: Register new beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - gender
 *               - mobile
 *               - aadhaar
 *               - caste
 *               - category
 *               - permanentAddress
 *               - bankDetails
 *               - caseDetails
 *               - economicStatus
 *               - dbtDetails
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other, transgender]
 *               mobile:
 *                 type: string
 *               aadhaar:
 *                 type: string
 *               caste:
 *                 type: string
 *                 enum: [SC, ST, OBC, General]
 *               category:
 *                 type: string
 *                 enum: [victim, dependent, witness]
 *               permanentAddress:
 *                 type: object
 *               bankDetails:
 *                 type: object
 *               caseDetails:
 *                 type: object
 *               economicStatus:
 *                 type: object
 *               dbtDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Beneficiary registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  authMiddleware,
  roleMiddleware('field_officer', 'beneficiary'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other', 'transgender']).withMessage('Valid gender is required'),
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('aadhaar').matches(/^\d{12}$/).withMessage('Valid 12-digit Aadhaar number is required'),
  body('caste').isIn(['SC', 'ST', 'OBC', 'General']).withMessage('Valid caste is required'),
  body('category').isIn(['victim', 'dependent', 'witness']).withMessage('Valid category is required'),
  body('permanentAddress.street').notEmpty().withMessage('Street address is required'),
  body('permanentAddress.city').notEmpty().withMessage('City is required'),
  body('permanentAddress.district').notEmpty().withMessage('District is required'),
  body('permanentAddress.state').notEmpty().withMessage('State is required'),
  body('permanentAddress.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('bankDetails.accountHolderName').notEmpty().withMessage('Account holder name is required'),
  body('bankDetails.accountNumber').notEmpty().withMessage('Bank account number is required'),
  body('bankDetails.ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Valid IFSC code is required'),
  body('bankDetails.bankName').notEmpty().withMessage('Bank name is required'),
  body('bankDetails.branchName').notEmpty().withMessage('Branch name is required'),
  body('caseDetails.caseNumber').notEmpty().withMessage('Case number is required'),
  body('caseDetails.caseType').isIn(['PCR', 'POA', 'other']).withMessage('Valid case type is required'),
  body('caseDetails.incidentDate').isISO8601().withMessage('Valid incident date is required'),
  body('caseDetails.incidentLocation').notEmpty().withMessage('Incident location is required'),
  body('caseDetails.policeStation').notEmpty().withMessage('Police station is required'),
  body('economicStatus.annualIncome').isNumeric().withMessage('Valid annual income is required'),
  body('economicStatus.occupation').notEmpty().withMessage('Occupation is required'),
  body('economicStatus.employmentStatus').isIn(['employed', 'unemployed', 'self_employed', 'student', 'retired', 'housewife']).withMessage('Valid employment status is required'),
  body('dbtDetails.schemeName').notEmpty().withMessage('Scheme name is required'),
  body('dbtDetails.schemeCode').notEmpty().withMessage('Scheme code is required'),
  body('dbtDetails.sanctionedAmount').isNumeric().withMessage('Valid sanctioned amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    // Check if beneficiary already exists
    const existingBeneficiary = await Beneficiary.findOne({
      $or: [
        { aadhaar: req.body.aadhaar },
        { mobile: req.body.mobile }
      ]
    });

    if (existingBeneficiary) {
      return ResponseFormatter.error(res, 'Beneficiary already exists with this Aadhaar or mobile number', 409);
    }

    // Create beneficiary
    const beneficiaryData = {
      ...req.body,
      createdBy: req.user.id
    };

    const beneficiary = await Beneficiary.create(beneficiaryData);

    logger.info(`New beneficiary registered: ${beneficiary.fullName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, beneficiary, 'Beneficiary registered successfully', 201);
  } catch (error) {
    logger.error('Beneficiary registration error:', error);
    ResponseFormatter.error(res, 'Beneficiary registration failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/beneficiaries:
 *   get:
 *     summary: Get all beneficiaries with pagination and filters
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, submitted, under_review, approved, rejected, disbursed]
 *       - in: query
 *         name: caste
 *         schema:
 *           type: string
 *           enum: [SC, ST, OBC, General]
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Beneficiaries retrieved successfully
 */
router.get('/', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed']).withMessage('Invalid status'),
  query('caste').optional().isIn(['SC', 'ST', 'OBC', 'General']).withMessage('Invalid caste'),
  query('state').optional().isString().withMessage('State must be a string'),
  query('district').optional().isString().withMessage('District must be a string'),
  query('search').optional().isString().withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isDeleted: false };

    // Role-based filtering
    if (req.user.role === 'field_officer') {
      filter.createdBy = req.user.id;
    } else if (req.user.role === 'beneficiary') {
      filter.createdBy = req.user.id;
    }

    // Apply filters
    if (req.query.status) {
      filter.applicationStatus = req.query.status;
    }
    if (req.query.caste) {
      filter.caste = req.query.caste;
    }
    if (req.query.state) {
      filter['permanentAddress.state'] = new RegExp(req.query.state, 'i');
    }
    if (req.query.district) {
      filter['permanentAddress.district'] = new RegExp(req.query.district, 'i');
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { mobile: searchRegex },
        { 'caseDetails.caseNumber': searchRegex }
      ];
    }

    // Get beneficiaries with pagination
    const beneficiaries = await Beneficiary.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('disbursedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Beneficiary.countDocuments(filter);

    ResponseFormatter.paginated(res, beneficiaries, {
      page,
      limit,
      total
    }, 'Beneficiaries retrieved successfully');
  } catch (error) {
    logger.error('Beneficiaries retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve beneficiaries', 500, error.message);
  }
});

/**
 * @swagger
 * /api/beneficiaries/{id}:
 *   get:
 *     summary: Get beneficiary by ID
 *     tags: [Beneficiaries]
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
 *         description: Beneficiary retrieved successfully
 *       404:
 *         description: Beneficiary not found
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('disbursedBy', 'firstName lastName email');

    if (!beneficiary) {
      return ResponseFormatter.notFound(res, 'Beneficiary not found');
    }

    // Check access permissions
    if (req.user.role === 'field_officer' && beneficiary.createdBy._id.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }
    if (req.user.role === 'beneficiary' && beneficiary.createdBy._id.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }

    ResponseFormatter.success(res, beneficiary, 'Beneficiary retrieved successfully');
  } catch (error) {
    logger.error('Beneficiary retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve beneficiary', 500, error.message);
  }
});

/**
 * @swagger
 * /api/beneficiaries/{id}:
 *   put:
 *     summary: Update beneficiary information
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Beneficiary updated successfully
 *       404:
 *         description: Beneficiary not found
 */
router.put('/:id', [
  authMiddleware,
  roleMiddleware('field_officer', 'beneficiary')
], async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
      return ResponseFormatter.notFound(res, 'Beneficiary not found');
    }

    // Check access permissions
    if (req.user.role === 'field_officer' && beneficiary.createdBy.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }
    if (req.user.role === 'beneficiary' && beneficiary.createdBy.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }

    // Prevent updating certain fields after approval
    if (beneficiary.applicationStatus === 'approved' || beneficiary.applicationStatus === 'disbursed') {
      const restrictedFields = ['aadhaar', 'bankDetails', 'caseDetails'];
      for (const field of restrictedFields) {
        if (req.body[field]) {
          delete req.body[field];
        }
      }
    }

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    logger.info(`Beneficiary updated: ${updatedBeneficiary.fullName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, updatedBeneficiary, 'Beneficiary updated successfully');
  } catch (error) {
    logger.error('Beneficiary update error:', error);
    ResponseFormatter.error(res, 'Beneficiary update failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/beneficiaries/{id}/status:
 *   put:
 *     summary: Update beneficiary application status
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [submitted, under_review, approved, rejected, disbursed]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin'),
  body('status').isIn(['submitted', 'under_review', 'approved', 'rejected', 'disbursed']).withMessage('Valid status is required'),
  body('remarks').optional().isString().withMessage('Remarks must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
      return ResponseFormatter.notFound(res, 'Beneficiary not found');
    }

    await beneficiary.updateStatus(req.body.status, req.user.id, req.body.remarks);

    logger.info(`Beneficiary status updated: ${beneficiary.fullName} to ${req.body.status} by user: ${req.user.email}`);

    ResponseFormatter.success(res, beneficiary, 'Status updated successfully');
  } catch (error) {
    logger.error('Status update error:', error);
    ResponseFormatter.error(res, 'Status update failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/beneficiaries/{id}:
 *   delete:
 *     summary: Archive beneficiary (soft delete)
 *     tags: [Beneficiaries]
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
 *         description: Beneficiary archived successfully
 */
router.delete('/:id', [
  authMiddleware,
  roleMiddleware('admin', 'field_officer')
], async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
      return ResponseFormatter.notFound(res, 'Beneficiary not found');
    }

    // Check access permissions
    if (req.user.role === 'field_officer' && beneficiary.createdBy.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }

    beneficiary.isDeleted = true;
    beneficiary.isActive = false;
    await beneficiary.save();

    logger.info(`Beneficiary archived: ${beneficiary.fullName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, null, 'Beneficiary archived successfully');
  } catch (error) {
    logger.error('Beneficiary archive error:', error);
    ResponseFormatter.error(res, 'Beneficiary archive failed', 500, error.message);
  }
});

module.exports = router;
