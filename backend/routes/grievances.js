const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Grievance = require('../models/Grievance');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/grievances:
 *   post:
 *     summary: Submit a new grievance
 *     tags: [Grievances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [application_status, payment_issues, document_verification, technical_issues, general_inquiry, complaint, other]
 *               subCategory:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               relatedApplication:
 *                 type: string
 *               relatedBeneficiary:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grievance submitted successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['application_status', 'payment_issues', 'document_verification', 'technical_issues', 'general_inquiry', 'complaint', 'other']).withMessage('Valid category is required'),
  body('subCategory').optional().isString().withMessage('Sub-category must be a string'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority is required'),
  body('relatedApplication').optional().isString().withMessage('Related application must be a string'),
  body('relatedBeneficiary').optional().isMongoId().withMessage('Valid beneficiary ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const {
      title,
      description,
      category,
      subCategory,
      priority = 'medium',
      relatedApplication,
      relatedBeneficiary
    } = req.body;

    // Create grievance
    const grievanceData = {
      title,
      description,
      category,
      subCategory,
      priority,
      complainant: req.user.id,
      complainantName: req.user.fullName,
      complainantEmail: req.user.email,
      complainantMobile: req.user.mobile,
      complainantType: req.user.role === 'beneficiary' ? 'beneficiary' : 'officer',
      relatedApplication,
      relatedBeneficiary,
      createdBy: req.user.id
    };

    const grievance = await Grievance.create(grievanceData);

    logger.info(`New grievance submitted: ${grievance.title} by user: ${req.user.email}`);

    ResponseFormatter.success(res, grievance, 'Grievance submitted successfully', 201);
  } catch (error) {
    logger.error('Grievance submission error:', error);
    ResponseFormatter.error(res, 'Grievance submission failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances:
 *   get:
 *     summary: Get all grievances with pagination and filters
 *     tags: [Grievances]
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
 *           enum: [open, in_progress, resolved, closed, rejected]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *       - in: query
 *         name: assigned
 *         schema:
 *           type: string
 *           enum: [assigned, unassigned]
 *     responses:
 *       200:
 *         description: Grievances retrieved successfully
 */
router.get('/', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed', 'rejected']).withMessage('Invalid status'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  query('assigned').optional().isIn(['assigned', 'unassigned']).withMessage('Invalid assigned filter')
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
    if (req.user.role === 'beneficiary') {
      filter.complainant = req.user.id;
    } else if (req.user.role === 'field_officer') {
      filter.$or = [
        { complainant: req.user.id },
        { assignedTo: req.user.id }
      ];
    }

    // Apply filters
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = new RegExp(req.query.category, 'i');
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.assigned === 'assigned') {
      filter.assignedTo = { $exists: true, $ne: null };
    } else if (req.query.assigned === 'unassigned') {
      filter.assignedTo = { $exists: false };
    }

    // Get grievances with pagination
    const grievances = await Grievance.find(filter)
      .populate('complainant', 'firstName lastName email mobile')
      .populate('assignedTo', 'firstName lastName email')
      .populate('resolution.resolvedBy', 'firstName lastName email')
      .populate('escalation.escalatedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Grievance.countDocuments(filter);

    ResponseFormatter.paginated(res, grievances, {
      page,
      limit,
      total
    }, 'Grievances retrieved successfully');
  } catch (error) {
    logger.error('Grievances retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve grievances', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/{id}:
 *   get:
 *     summary: Get grievance by ID
 *     tags: [Grievances]
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
 *         description: Grievance retrieved successfully
 *       404:
 *         description: Grievance not found
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('complainant', 'firstName lastName email mobile')
      .populate('assignedTo', 'firstName lastName email')
      .populate('resolution.resolvedBy', 'firstName lastName email')
      .populate('escalation.escalatedTo', 'firstName lastName email')
      .populate('relatedBeneficiary', 'firstName lastName mobile aadhaar');

    if (!grievance) {
      return ResponseFormatter.notFound(res, 'Grievance not found');
    }

    // Check access permissions
    if (req.user.role === 'beneficiary' && grievance.complainant._id.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Access denied');
    }

    ResponseFormatter.success(res, grievance, 'Grievance retrieved successfully');
  } catch (error) {
    logger.error('Grievance retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve grievance', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/{id}/assign:
 *   put:
 *     summary: Assign grievance to an officer
 *     tags: [Grievances]
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
 *               - assignedTo
 *             properties:
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grievance assigned successfully
 */
router.put('/:id/assign', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin'),
  body('assignedTo').isMongoId().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return ResponseFormatter.notFound(res, 'Grievance not found');
    }

    if (grievance.status === 'resolved' || grievance.status === 'closed') {
      return ResponseFormatter.error(res, 'Cannot assign resolved or closed grievance', 400);
    }

    await grievance.assign(req.body.assignedTo, req.user.id);

    logger.info(`Grievance assigned: ${grievance.title} to user: ${req.body.assignedTo} by user: ${req.user.email}`);

    ResponseFormatter.success(res, grievance, 'Grievance assigned successfully');
  } catch (error) {
    logger.error('Grievance assignment error:', error);
    ResponseFormatter.error(res, 'Grievance assignment failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/{id}/resolve:
 *   put:
 *     summary: Resolve a grievance
 *     tags: [Grievances]
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
 *               - description
 *               - resolutionType
 *             properties:
 *               description:
 *                 type: string
 *               resolutionType:
 *                 type: string
 *                 enum: [resolved, duplicate, invalid, escalated, closed]
 *               followUpRequired:
 *                 type: boolean
 *               followUpDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Grievance resolved successfully
 */
router.put('/:id/resolve', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'field_officer', 'admin'),
  body('description').notEmpty().withMessage('Resolution description is required'),
  body('resolutionType').isIn(['resolved', 'duplicate', 'invalid', 'escalated', 'closed']).withMessage('Valid resolution type is required'),
  body('followUpRequired').optional().isBoolean().withMessage('Follow-up required must be boolean'),
  body('followUpDate').optional().isISO8601().withMessage('Valid follow-up date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return ResponseFormatter.notFound(res, 'Grievance not found');
    }

    if (grievance.status === 'resolved' || grievance.status === 'closed') {
      return ResponseFormatter.error(res, 'Grievance is already resolved or closed', 400);
    }

    // Check if user is assigned to this grievance or has admin privileges
    if (req.user.role !== 'admin' && grievance.assignedTo?.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'You are not assigned to this grievance');
    }

    const resolutionData = {
      description: req.body.description,
      resolutionType: req.body.resolutionType,
      followUpRequired: req.body.followUpRequired || false,
      followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : null
    };

    await grievance.resolve(req.user.id, resolutionData);

    logger.info(`Grievance resolved: ${grievance.title} by user: ${req.user.email}`);

    ResponseFormatter.success(res, grievance, 'Grievance resolved successfully');
  } catch (error) {
    logger.error('Grievance resolution error:', error);
    ResponseFormatter.error(res, 'Grievance resolution failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/{id}/escalate:
 *   put:
 *     summary: Escalate a grievance
 *     tags: [Grievances]
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
 *               - escalatedTo
 *               - reason
 *             properties:
 *               escalatedTo:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grievance escalated successfully
 */
router.put('/:id/escalate', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'field_officer', 'admin'),
  body('escalatedTo').isMongoId().withMessage('Valid user ID is required'),
  body('reason').notEmpty().withMessage('Escalation reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return ResponseFormatter.notFound(res, 'Grievance not found');
    }

    if (grievance.status === 'resolved' || grievance.status === 'closed') {
      return ResponseFormatter.error(res, 'Cannot escalate resolved or closed grievance', 400);
    }

    await grievance.escalate(req.body.escalatedTo, req.user.id, req.body.reason);

    logger.info(`Grievance escalated: ${grievance.title} to user: ${req.body.escalatedTo} by user: ${req.user.email}`);

    ResponseFormatter.success(res, grievance, 'Grievance escalated successfully');
  } catch (error) {
    logger.error('Grievance escalation error:', error);
    ResponseFormatter.error(res, 'Grievance escalation failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/{id}/feedback:
 *   post:
 *     summary: Submit feedback for a resolved grievance
 *     tags: [Grievances]
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 */
router.post('/:id/feedback', [
  authMiddleware,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string'),
  body('isPublic').optional().isBoolean().withMessage('Public flag must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return ResponseFormatter.notFound(res, 'Grievance not found');
    }

    if (grievance.status !== 'resolved') {
      return ResponseFormatter.error(res, 'Feedback can only be submitted for resolved grievances', 400);
    }

    // Check if user is the complainant
    if (grievance.complainant.toString() !== req.user.id) {
      return ResponseFormatter.forbidden(res, 'Only the complainant can submit feedback');
    }

    if (grievance.feedback.rating) {
      return ResponseFormatter.error(res, 'Feedback already submitted for this grievance', 400);
    }

    const feedbackData = {
      rating: req.body.rating,
      comment: req.body.comment,
      isPublic: req.body.isPublic || false
    };

    await grievance.submitFeedback(feedbackData);

    logger.info(`Feedback submitted for grievance: ${grievance.title} by user: ${req.user.email}`);

    ResponseFormatter.success(res, grievance, 'Feedback submitted successfully');
  } catch (error) {
    logger.error('Feedback submission error:', error);
    ResponseFormatter.error(res, 'Feedback submission failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/grievances/stats:
 *   get:
 *     summary: Get grievance statistics
 *     tags: [Grievances]
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
 *         description: Grievance statistics retrieved successfully
 */
router.get('/stats', [
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

    const stats = await Grievance.getStats({
      createdAt: dateFilter
    });

    const overdueGrievances = await Grievance.getOverdueGrievances();

    const summary = {
      period,
      statusBreakdown: stats,
      overdueCount: overdueGrievances.length,
      totalGrievances: stats.reduce((sum, stat) => sum + stat.count, 0)
    };

    ResponseFormatter.success(res, summary, 'Grievance statistics retrieved successfully');
  } catch (error) {
    logger.error('Grievance stats error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve grievance statistics', 500, error.message);
  }
});

module.exports = router;
