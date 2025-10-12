const express = require('express');
const { query, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get dashboard overview statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview retrieved successfully
 */
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    // Mock dashboard data - in real implementation, this would come from database
    const overview = {
      totalUsers: 1245,
      activeUsers: 89,
      totalApplications: 3456,
      pendingApplications: 234,
      approvedApplications: 2890,
      rejectedApplications: 332,
      totalFundsSanctioned: 45200000, // ₹4.52 Cr
      totalFundsDisbursed: 42800000,  // ₹4.28 Cr
      pendingDisbursements: 2400000,  // ₹24 Lakh
      activeGrievances: 23,
      resolvedGrievances: 156,
      systemUptime: 99.9,
      averageResponseTime: 1.2,
      recentActivity: [
        {
          id: 1,
          type: 'application_approved',
          message: 'Application DBT2025001234 approved for Rajesh Kumar',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'State Welfare Officer'
        },
        {
          id: 2,
          type: 'payment_disbursed',
          message: 'Payment of ₹50,000 disbursed to Meera Devi',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'Financial Officer'
        },
        {
          id: 3,
          type: 'grievance_resolved',
          message: 'Grievance GRV001 resolved by Grievance Officer',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: 'Grievance Officer'
        }
      ]
    };

    // Role-specific data
    if (req.user.role === 'field_officer') {
      overview.roleSpecific = {
        myApplications: 45,
        pendingVerification: 12,
        verifiedToday: 8
      };
    } else if (req.user.role === 'scheme_officer') {
      overview.roleSpecific = {
        pendingApprovals: 156,
        approvedToday: 23,
        stateCoverage: 92
      };
    } else if (req.user.role === 'beneficiary') {
      overview.roleSpecific = {
        myApplications: 3,
        approvedApplications: 1,
        pendingApplications: 2,
        totalReceived: 75000
      };
    }

    ResponseFormatter.success(res, overview, 'Dashboard overview retrieved successfully');
  } catch (error) {
    logger.error('Dashboard overview error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve dashboard overview', 500, error.message);
  }
});

/**
 * @swagger
 * /api/dashboard/heatmap:
 *   get:
 *     summary: Get disbursement heatmap data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [state, district]
 *           default: state
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, quarter, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Heatmap data retrieved successfully
 */
router.get('/heatmap', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer', 'auditor'),
  query('type').optional().isIn(['state', 'district']).withMessage('Invalid heatmap type'),
  query('period').optional().isIn(['month', 'quarter', 'year']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const type = req.query.type || 'state';
    const period = req.query.period || 'month';

    // Mock heatmap data - in real implementation, this would come from database
    const heatmapData = type === 'state' ? [
      {
        state: 'Maharashtra',
        disbursed: 12500000,
        beneficiaries: 156,
        intensity: 0.9
      },
      {
        state: 'Uttar Pradesh',
        disbursed: 9800000,
        beneficiaries: 123,
        intensity: 0.8
      },
      {
        state: 'Bihar',
        disbursed: 7500000,
        beneficiaries: 89,
        intensity: 0.7
      },
      {
        state: 'West Bengal',
        disbursed: 6200000,
        beneficiaries: 67,
        intensity: 0.6
      },
      {
        state: 'Tamil Nadu',
        disbursed: 5800000,
        beneficiaries: 54,
        intensity: 0.5
      }
    ] : [
      {
        district: 'Mumbai',
        state: 'Maharashtra',
        disbursed: 4500000,
        beneficiaries: 45,
        intensity: 0.9
      },
      {
        district: 'Pune',
        state: 'Maharashtra',
        disbursed: 3200000,
        beneficiaries: 32,
        intensity: 0.8
      },
      {
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        disbursed: 2800000,
        beneficiaries: 28,
        intensity: 0.7
      },
      {
        district: 'Kanpur',
        state: 'Uttar Pradesh',
        disbursed: 2100000,
        beneficiaries: 21,
        intensity: 0.6
      }
    ];

    ResponseFormatter.success(res, {
      type,
      period,
      data: heatmapData
    }, 'Heatmap data retrieved successfully');
  } catch (error) {
    logger.error('Heatmap data error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve heatmap data', 500, error.message);
  }
});

/**
 * @swagger
 * /api/dashboard/audit:
 *   get:
 *     summary: Get latest audit entries
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Latest audit entries retrieved successfully
 */
router.get('/audit', [
  authMiddleware,
  roleMiddleware('admin', 'auditor'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const limit = parseInt(req.query.limit) || 10;

    // Mock audit entries - in real implementation, this would come from database
    const auditEntries = [
      {
        id: 'AUD001',
        action: 'Application Approved',
        user: 'State Welfare Officer',
        timestamp: new Date().toISOString(),
        status: 'success',
        details: 'Approved application DBT2025001234 for Rajesh Kumar'
      },
      {
        id: 'AUD002',
        action: 'Payment Processed',
        user: 'Financial Officer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'success',
        details: 'Processed payment of ₹50,000 to account ending 7890'
      },
      {
        id: 'AUD003',
        action: 'Failed Login Attempt',
        user: 'Unknown',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'error',
        details: 'Multiple failed login attempts from IP 203.0.113.1'
      },
      {
        id: 'AUD004',
        action: 'Document Verification',
        user: 'District Officer',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'success',
        details: 'Verified documents for application DBT2025001235'
      },
      {
        id: 'AUD005',
        action: 'System Configuration Change',
        user: 'System Admin',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        status: 'warning',
        details: 'Updated payment gateway configuration'
      }
    ].slice(0, limit);

    ResponseFormatter.success(res, auditEntries, 'Latest audit entries retrieved successfully');
  } catch (error) {
    logger.error('Dashboard audit error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve audit entries', 500, error.message);
  }
});

/**
 * @swagger
 * /api/dashboard/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unread
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/notifications', [
  authMiddleware,
  query('unread').optional().isBoolean().withMessage('Unread filter must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const unreadOnly = req.query.unread === 'true';

    // Mock notifications - in real implementation, this would come from database
    const notifications = [
      {
        id: 'NOT001',
        title: 'Application Status Update',
        message: 'Your application DBT2025001234 has been approved',
        type: 'success',
        isRead: false,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        actionUrl: '/beneficiaries/DBT2025001234'
      },
      {
        id: 'NOT002',
        title: 'Payment Disbursed',
        message: 'Payment of ₹50,000 has been credited to your account',
        type: 'info',
        isRead: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/funds/status/DBT2025001234'
      },
      {
        id: 'NOT003',
        title: 'Document Verification Required',
        message: 'Please upload your caste certificate for verification',
        type: 'warning',
        isRead: true,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        actionUrl: '/documents/upload'
      },
      {
        id: 'NOT004',
        title: 'Grievance Resolved',
        message: 'Your grievance GRV001 has been resolved',
        type: 'success',
        isRead: true,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        actionUrl: '/grievances/GRV001'
      }
    ];

    const filteredNotifications = unreadOnly 
      ? notifications.filter(notif => !notif.isRead)
      : notifications;

    ResponseFormatter.success(res, filteredNotifications, 'Notifications retrieved successfully');
  } catch (error) {
    logger.error('Dashboard notifications error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve notifications', 500, error.message);
  }
});

module.exports = router;
