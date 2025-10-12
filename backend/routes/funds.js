const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Fund = require('../models/Fund');
const Beneficiary = require('../models/Beneficiary');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/funds/sanction:
 *   post:
 *     summary: Initiate DBT transfer (sanction funds)
 *     tags: [Funds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beneficiaryId
 *               - scheme
 *               - amount
 *               - bankDetails
 *               - sanction
 *             properties:
 *               beneficiaryId:
 *                 type: string
 *               scheme:
 *                 type: object
 *               amount:
 *                 type: object
 *               bankDetails:
 *                 type: object
 *               sanction:
 *                 type: object
 *     responses:
 *       201:
 *         description: Fund sanction initiated successfully
 *       400:
 *         description: Validation error
 */
router.post('/sanction', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin'),
  body('beneficiaryId').isMongoId().withMessage('Valid beneficiary ID is required'),
  body('scheme.name').notEmpty().withMessage('Scheme name is required'),
  body('scheme.code').notEmpty().withMessage('Scheme code is required'),
  body('scheme.category').isIn(['PCR', 'POA', 'other']).withMessage('Valid scheme category is required'),
  body('amount.sanctioned').isNumeric().withMessage('Valid sanctioned amount is required'),
  body('bankDetails.accountHolderName').notEmpty().withMessage('Account holder name is required'),
  body('bankDetails.accountNumber').notEmpty().withMessage('Account number is required'),
  body('bankDetails.ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Valid IFSC code is required'),
  body('bankDetails.bankName').notEmpty().withMessage('Bank name is required'),
  body('bankDetails.branchName').notEmpty().withMessage('Branch name is required'),
  body('sanction.orderNumber').notEmpty().withMessage('Sanction order number is required'),
  body('sanction.orderDate').isISO8601().withMessage('Valid sanction order date is required'),
  body('sanction.validUntil').isISO8601().withMessage('Valid sanction validity date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const {
      beneficiaryId,
      scheme,
      amount,
      bankDetails,
      sanction,
      priority = 'medium'
    } = req.body;

    // Check if beneficiary exists and is approved
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return ResponseFormatter.notFound(res, 'Beneficiary not found');
    }

    if (beneficiary.applicationStatus !== 'approved') {
      return ResponseFormatter.error(res, 'Beneficiary application is not approved', 400);
    }

    // Check if fund already exists for this beneficiary and scheme
    const existingFund = await Fund.findOne({
      beneficiary: beneficiaryId,
      'scheme.code': scheme.code,
      isDeleted: false
    });

    if (existingFund) {
      return ResponseFormatter.error(res, 'Fund already sanctioned for this beneficiary under this scheme', 409);
    }

    // Create fund sanction
    const fundData = {
      beneficiary: beneficiaryId,
      beneficiaryName: beneficiary.fullName,
      beneficiaryAadhaar: beneficiary.aadhaar,
      scheme,
      amount: {
        sanctioned: amount.sanctioned,
        disbursed: 0,
        pending: amount.sanctioned
      },
      bankDetails,
      sanction,
      priority,
      'audit.createdBy': req.user.id
    };

    const fund = await Fund.create(fundData);

    // Update beneficiary disbursement status
    beneficiary.dbtDetails.disbursementStatus = 'pending';
    beneficiary.dbtDetails.sanctionedAmount = amount.sanctioned;
    await beneficiary.save();

    logger.info(`Fund sanctioned: ₹${amount.sanctioned} for beneficiary ${beneficiary.fullName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, fund, 'Fund sanction initiated successfully', 201);
  } catch (error) {
    logger.error('Fund sanction error:', error);
    ResponseFormatter.error(res, 'Fund sanction failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds:
 *   get:
 *     summary: Get all fund sanctions with pagination and filters
 *     tags: [Funds]
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
 *           enum: [pending, initiated, processing, successful, failed, cancelled]
 *       - in: query
 *         name: scheme
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *     responses:
 *       200:
 *         description: Funds retrieved successfully
 */
router.get('/', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'initiated', 'processing', 'successful', 'failed', 'cancelled']).withMessage('Invalid status'),
  query('scheme').optional().isString().withMessage('Scheme must be a string'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
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

    // Apply filters
    if (req.query.status) {
      filter['transaction.status'] = req.query.status;
    }
    if (req.query.scheme) {
      filter['scheme.code'] = new RegExp(req.query.scheme, 'i');
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Get funds with pagination
    const funds = await Fund.find(filter)
      .populate('beneficiary', 'firstName lastName mobile aadhaar')
      .populate('audit.createdBy', 'firstName lastName email')
      .populate('approval.approvedBy', 'firstName lastName email')
      .populate('disbursement.initiatedBy', 'firstName lastName email')
      .populate('disbursement.processedBy', 'firstName lastName email')
      .populate('disbursement.completedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fund.countDocuments(filter);

    ResponseFormatter.paginated(res, funds, {
      page,
      limit,
      total
    }, 'Funds retrieved successfully');
  } catch (error) {
    logger.error('Funds retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve funds', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds/status/{beneficiaryId}:
 *   get:
 *     summary: Track disbursement status for a beneficiary
 *     tags: [Funds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: beneficiaryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disbursement status retrieved successfully
 *       404:
 *         description: No fund records found for beneficiary
 */
router.get('/status/:beneficiaryId', authMiddleware, async (req, res) => {
  try {
    const funds = await Fund.find({
      beneficiary: req.params.beneficiaryId,
      isDeleted: false
    })
    .populate('beneficiary', 'firstName lastName mobile aadhaar')
    .populate('approval.approvedBy', 'firstName lastName email')
    .populate('disbursement.completedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

    if (funds.length === 0) {
      return ResponseFormatter.notFound(res, 'No fund records found for this beneficiary');
    }

    // Check access permissions
    if (req.user.role === 'beneficiary') {
      const beneficiary = await Beneficiary.findById(req.params.beneficiaryId);
      if (!beneficiary || beneficiary.createdBy.toString() !== req.user.id) {
        return ResponseFormatter.forbidden(res, 'Access denied');
      }
    }

    ResponseFormatter.success(res, funds, 'Disbursement status retrieved successfully');
  } catch (error) {
    logger.error('Fund status retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve fund status', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds/{id}/approve:
 *   put:
 *     summary: Approve fund sanction
 *     tags: [Funds]
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
 *             properties:
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fund approved successfully
 */
router.put('/:id/approve', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin'),
  body('remarks').optional().isString().withMessage('Remarks must be a string')
], async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id);

    if (!fund) {
      return ResponseFormatter.notFound(res, 'Fund record not found');
    }

    if (fund.approval.status !== 'pending') {
      return ResponseFormatter.error(res, 'Fund is not in pending status', 400);
    }

    await fund.approve(req.user.id, req.body.remarks);

    logger.info(`Fund approved: ₹${fund.amount.sanctioned} for beneficiary ${fund.beneficiaryName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, fund, 'Fund approved successfully');
  } catch (error) {
    logger.error('Fund approval error:', error);
    ResponseFormatter.error(res, 'Fund approval failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds/{id}/reject:
 *   put:
 *     summary: Reject fund sanction
 *     tags: [Funds]
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
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fund rejected successfully
 */
router.put('/:id/reject', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin'),
  body('reason').notEmpty().withMessage('Rejection reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const fund = await Fund.findById(req.params.id);

    if (!fund) {
      return ResponseFormatter.notFound(res, 'Fund record not found');
    }

    if (fund.approval.status !== 'pending') {
      return ResponseFormatter.error(res, 'Fund is not in pending status', 400);
    }

    await fund.reject(req.user.id, req.body.reason);

    logger.info(`Fund rejected: ₹${fund.amount.sanctioned} for beneficiary ${fund.beneficiaryName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, fund, 'Fund rejected successfully');
  } catch (error) {
    logger.error('Fund rejection error:', error);
    ResponseFormatter.error(res, 'Fund rejection failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds/{id}/disburse:
 *   put:
 *     summary: Initiate fund disbursement
 *     tags: [Funds]
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
 *         description: Disbursement initiated successfully
 */
router.put('/:id/disburse', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin')
], async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id);

    if (!fund) {
      return ResponseFormatter.notFound(res, 'Fund record not found');
    }

    if (fund.approval.status !== 'approved') {
      return ResponseFormatter.error(res, 'Fund is not approved', 400);
    }

    if (fund.transaction.status !== 'pending') {
      return ResponseFormatter.error(res, 'Fund is not in pending disbursement status', 400);
    }

    // Check sanction validity
    if (!fund.isSanctionValid) {
      return ResponseFormatter.error(res, 'Sanction has expired', 400);
    }

    await fund.initiateDisbursement(req.user.id);

    // TODO: Integrate with actual DBT API/PFMS
    // For now, simulate successful disbursement
    setTimeout(async () => {
      try {
        const utrNumber = `UTR${Date.now()}${Math.floor(Math.random() * 1000)}`;
        await fund.completeTransaction(req.user.id, utrNumber);

        // Update beneficiary status
        const beneficiary = await Beneficiary.findById(fund.beneficiary);
        if (beneficiary) {
          beneficiary.dbtDetails.disbursementStatus = 'successful';
          beneficiary.dbtDetails.disbursedAmount = fund.amount.disbursed;
          beneficiary.dbtDetails.utrNumber = utrNumber;
          beneficiary.applicationStatus = 'disbursed';
          await beneficiary.save();
        }

        logger.info(`Fund disbursed successfully: ₹${fund.amount.disbursed} for beneficiary ${fund.beneficiaryName}, UTR: ${utrNumber}`);
      } catch (error) {
        logger.error('Disbursement completion error:', error);
        await fund.failTransaction('Disbursement failed');
      }
    }, 5000); // Simulate 5 second processing time

    logger.info(`Disbursement initiated: ₹${fund.amount.sanctioned} for beneficiary ${fund.beneficiaryName} by user: ${req.user.email}`);

    ResponseFormatter.success(res, fund, 'Disbursement initiated successfully');
  } catch (error) {
    logger.error('Disbursement initiation error:', error);
    ResponseFormatter.error(res, 'Disbursement initiation failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/funds/summary:
 *   get:
 *     summary: Get fund disbursement summary
 *     tags: [Funds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, quarter, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Fund summary retrieved successfully
 */
router.get('/summary', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin', 'auditor'),
  query('period').optional().isIn(['today', 'week', 'month', 'quarter', 'year']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const period = req.query.period || 'month';
    let dateFilter = {};

    const now = new Date();
    switch (period) {
      case 'today':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
        };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { $gte: weekAgo };
        break;
      case 'month':
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        dateFilter = { $gte: quarterStart };
        break;
      case 'year':
        dateFilter = {
          $gte: new Date(now.getFullYear(), 0, 1)
        };
        break;
    }

    const stats = await Fund.getDisbursementStats({
      createdAt: dateFilter
    });

    const totalSanctioned = await Fund.aggregate([
      { $match: { isDeleted: false, createdAt: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount.sanctioned' } } }
    ]);

    const totalDisbursed = await Fund.aggregate([
      { $match: { isDeleted: false, 'transaction.status': 'successful', createdAt: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount.disbursed' } } }
    ]);

    const summary = {
      period,
      totalSanctioned: totalSanctioned[0]?.total || 0,
      totalDisbursed: totalDisbursed[0]?.total || 0,
      pendingAmount: (totalSanctioned[0]?.total || 0) - (totalDisbursed[0]?.total || 0),
      statusBreakdown: stats,
      disbursementRate: totalSanctioned[0]?.total > 0 
        ? ((totalDisbursed[0]?.total || 0) / totalSanctioned[0].total * 100).toFixed(2)
        : 0
    };

    ResponseFormatter.success(res, summary, 'Fund summary retrieved successfully');
  } catch (error) {
    logger.error('Fund summary error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve fund summary', 500, error.message);
  }
});

module.exports = router;
