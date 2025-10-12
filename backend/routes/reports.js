const express = require('express');
const { query, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/reports/fund-flow:
 *   get:
 *     summary: Generate DBT flow reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly, yearly]
 *           default: monthly
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           default: 2025
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fund flow report generated successfully
 */
router.get('/fund-flow', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer', 'auditor'),
  query('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid period'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Valid year required'),
  query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Valid month required'),
  query('state').optional().isString().withMessage('State must be a string'),
  query('district').optional().isString().withMessage('District must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const period = req.query.period || 'monthly';
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const state = req.query.state;
    const district = req.query.district;

    // Mock fund flow data - in real implementation, this would come from database
    const fundFlowReport = {
      period,
      year,
      month,
      filters: {
        state,
        district
      },
      summary: {
        totalSanctioned: 12500000, // ₹1.25 Cr
        totalDisbursed: 11800000,  // ₹1.18 Cr
        pendingAmount: 700000,     // ₹7 Lakh
        disbursementRate: 94.4,
        totalBeneficiaries: 156,
        successfulDisbursements: 147,
        failedDisbursements: 9
      },
      schemeWise: [
        {
          schemeName: 'PCR Victim Compensation',
          schemeCode: 'PCR001',
          sanctioned: 8000000,
          disbursed: 7600000,
          beneficiaries: 95,
          disbursementRate: 95.0
        },
        {
          schemeName: 'POA Victim Support',
          schemeCode: 'POA001',
          sanctioned: 4500000,
          disbursed: 4200000,
          beneficiaries: 61,
          disbursementRate: 93.3
        }
      ],
      stateWise: [
        {
          state: 'Maharashtra',
          sanctioned: 7500000,
          disbursed: 7100000,
          beneficiaries: 89,
          disbursementRate: 94.7
        },
        {
          state: 'Uttar Pradesh',
          sanctioned: 5000000,
          disbursed: 4700000,
          beneficiaries: 67,
          disbursementRate: 94.0
        }
      ],
      monthlyTrend: [
        { month: 'Jan', sanctioned: 1200000, disbursed: 1150000 },
        { month: 'Feb', sanctioned: 1350000, disbursed: 1280000 },
        { month: 'Mar', sanctioned: 1100000, disbursed: 1050000 },
        { month: 'Apr', sanctioned: 1400000, disbursed: 1320000 },
        { month: 'May', sanctioned: 1250000, disbursed: 1180000 }
      ]
    };

    logger.info(`Fund flow report generated for ${period} ${year} by user: ${req.user.email}`);

    ResponseFormatter.success(res, fundFlowReport, 'Fund flow report generated successfully');
  } catch (error) {
    logger.error('Fund flow report error:', error);
    ResponseFormatter.error(res, 'Fund flow report generation failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/reports/beneficiary-stats:
 *   get:
 *     summary: Generate beneficiary statistics report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly, yearly]
 *           default: monthly
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           default: 2025
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [state, district, caste, category]
 *           default: state
 *     responses:
 *       200:
 *         description: Beneficiary statistics report generated successfully
 */
router.get('/beneficiary-stats', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer', 'auditor'),
  query('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid period'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Valid year required'),
  query('groupBy').optional().isIn(['state', 'district', 'caste', 'category']).withMessage('Invalid groupBy parameter')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const period = req.query.period || 'monthly';
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const groupBy = req.query.groupBy || 'state';

    // Mock beneficiary statistics - in real implementation, this would come from database
    const beneficiaryStats = {
      period,
      year,
      groupBy,
      summary: {
        totalBeneficiaries: 1256,
        newRegistrations: 89,
        approvedApplications: 78,
        disbursedApplications: 72,
        pendingApplications: 6,
        rejectedApplications: 11
      },
      breakdown: groupBy === 'state' ? [
        {
          state: 'Maharashtra',
          total: 456,
          approved: 34,
          disbursed: 31,
          pending: 3,
          rejected: 5
        },
        {
          state: 'Uttar Pradesh',
          total: 389,
          approved: 28,
          disbursed: 26,
          pending: 2,
          rejected: 4
        },
        {
          state: 'Bihar',
          total: 234,
          approved: 18,
          disbursed: 16,
          pending: 1,
          rejected: 2
        }
      ] : groupBy === 'caste' ? [
        {
          caste: 'SC',
          total: 567,
          approved: 42,
          disbursed: 38,
          pending: 3,
          rejected: 6
        },
        {
          caste: 'ST',
          total: 234,
          approved: 18,
          disbursed: 16,
          pending: 1,
          rejected: 2
        },
        {
          caste: 'OBC',
          total: 345,
          approved: 26,
          disbursed: 24,
          pending: 2,
          rejected: 3
        },
        {
          caste: 'General',
          total: 110,
          approved: 8,
          disbursed: 7,
          pending: 0,
          rejected: 1
        }
      ] : [
        {
          category: 'victim',
          total: 789,
          approved: 58,
          disbursed: 53,
          pending: 4,
          rejected: 7
        },
        {
          category: 'dependent',
          total: 345,
          approved: 26,
          disbursed: 24,
          pending: 2,
          rejected: 3
        },
        {
          category: 'witness',
          total: 122,
          approved: 9,
          disbursed: 8,
          pending: 0,
          rejected: 1
        }
      ],
      trends: {
        monthlyRegistrations: [
          { month: 'Jan', count: 45 },
          { month: 'Feb', count: 52 },
          { month: 'Mar', count: 38 },
          { month: 'Apr', count: 61 },
          { month: 'May', count: 48 }
        ],
        approvalRate: 87.6,
        disbursementRate: 92.3,
        averageProcessingTime: 15.2 // days
      }
    };

    logger.info(`Beneficiary statistics report generated for ${period} ${year} by user: ${req.user.email}`);

    ResponseFormatter.success(res, beneficiaryStats, 'Beneficiary statistics report generated successfully');
  } catch (error) {
    logger.error('Beneficiary stats report error:', error);
    ResponseFormatter.error(res, 'Beneficiary statistics report generation failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/reports/compliance:
 *   get:
 *     summary: Generate compliance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly, yearly]
 *           default: quarterly
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           default: 2025
 *     responses:
 *       200:
 *         description: Compliance report generated successfully
 */
router.get('/compliance', [
  authMiddleware,
  roleMiddleware('admin', 'auditor'),
  query('period').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid period'),
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Valid year required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const period = req.query.period || 'quarterly';
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Mock compliance report - in real implementation, this would come from database
    const complianceReport = {
      period,
      year,
      overallScore: 94.2,
      complianceAreas: [
        {
          area: 'Data Privacy & Security',
          score: 96.5,
          status: 'compliant',
          issues: [],
          recommendations: ['Implement additional encryption for sensitive data']
        },
        {
          area: 'Payment Processing',
          score: 89.2,
          status: 'non_compliant',
          issues: [
            'Missing audit trail for 3 transactions',
            'Incomplete KYC verification for 2 beneficiaries'
          ],
          recommendations: [
            'Implement comprehensive audit logging',
            'Strengthen KYC verification process'
          ]
        },
        {
          area: 'Access Control',
          score: 97.8,
          status: 'compliant',
          issues: [],
          recommendations: []
        },
        {
          area: 'Document Management',
          score: 92.1,
          status: 'compliant',
          issues: [],
          recommendations: ['Implement automated document verification']
        }
      ],
      auditFindings: [
        {
          severity: 'high',
          finding: 'Incomplete audit trail for fund disbursements',
          recommendation: 'Implement comprehensive logging for all financial transactions',
          status: 'open'
        },
        {
          severity: 'medium',
          finding: 'Some user accounts lack proper role-based access controls',
          recommendation: 'Review and update user permissions',
          status: 'in_progress'
        },
        {
          severity: 'low',
          finding: 'Document upload size limits need review',
          recommendation: 'Optimize file size limits for better user experience',
          status: 'resolved'
        }
      ],
      recommendations: [
        'Implement automated compliance monitoring',
        'Enhance audit logging capabilities',
        'Strengthen data encryption protocols',
        'Regular security assessments'
      ]
    };

    logger.info(`Compliance report generated for ${period} ${year} by user: ${req.user.email}`);

    ResponseFormatter.success(res, complianceReport, 'Compliance report generated successfully');
  } catch (error) {
    logger.error('Compliance report error:', error);
    ResponseFormatter.error(res, 'Compliance report generation failed', 500, error.message);
  }
});

module.exports = router;
