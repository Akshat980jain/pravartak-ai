const express = require('express');
const { query, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

// Mock audit logs - in real implementation, this would be stored in database
const auditLogs = [
  {
    id: 'AUD001',
    action: 'Application Approved',
    user: 'State Welfare Officer',
    role: 'scheme_officer',
    timestamp: new Date().toISOString(),
    details: 'Approved application DBT2025001234 for Rajesh Kumar',
    status: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AUD002',
    action: 'Payment Processed',
    user: 'Financial Officer',
    role: 'financial_officer',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Processed payment of ₹50,000 to account ending 7890',
    status: 'success',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'AUD003',
    action: 'Failed Login Attempt',
    user: 'Unknown',
    role: 'unknown',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Multiple failed login attempts from IP 203.0.113.1',
    status: 'error',
    ipAddress: '203.0.113.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

/**
 * @swagger
 * /api/audit/logs:
 *   get:
 *     summary: View audit logs
 *     tags: [Audit]
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
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [success, warning, error]
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
router.get('/logs', [
  authMiddleware,
  roleMiddleware('admin', 'auditor'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('action').optional().isString().withMessage('Action must be a string'),
  query('status').optional().isIn(['success', 'warning', 'error']).withMessage('Invalid status'),
  query('user').optional().isString().withMessage('User must be a string'),
  query('dateFrom').optional().isISO8601().withMessage('Valid date format required'),
  query('dateTo').optional().isISO8601().withMessage('Valid date format required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter logs based on query parameters
    let filteredLogs = [...auditLogs];

    if (req.query.action) {
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(req.query.action.toLowerCase())
      );
    }

    if (req.query.status) {
      filteredLogs = filteredLogs.filter(log => log.status === req.query.status);
    }

    if (req.query.user) {
      filteredLogs = filteredLogs.filter(log => 
        log.user.toLowerCase().includes(req.query.user.toLowerCase())
      );
    }

    if (req.query.dateFrom) {
      const dateFrom = new Date(req.query.dateFrom);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= dateFrom);
    }

    if (req.query.dateTo) {
      const dateTo = new Date(req.query.dateTo);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= dateTo);
    }

    // Pagination
    const total = filteredLogs.length;
    const paginatedLogs = filteredLogs.slice(skip, skip + limit);

    ResponseFormatter.paginated(res, paginatedLogs, {
      page,
      limit,
      total
    }, 'Audit logs retrieved successfully');
  } catch (error) {
    logger.error('Audit logs retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve audit logs', 500, error.message);
  }
});

/**
 * @swagger
 * /api/audit/export:
 *   get:
 *     summary: Export audit logs
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json, pdf]
 *           default: csv
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Audit logs exported successfully
 */
router.get('/export', [
  authMiddleware,
  roleMiddleware('admin', 'auditor'),
  query('format').optional().isIn(['csv', 'json', 'pdf']).withMessage('Invalid export format'),
  query('dateFrom').optional().isISO8601().withMessage('Valid date format required'),
  query('dateTo').optional().isISO8601().withMessage('Valid date format required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const format = req.query.format || 'csv';
    
    // Filter logs based on date range
    let filteredLogs = [...auditLogs];

    if (req.query.dateFrom) {
      const dateFrom = new Date(req.query.dateFrom);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= dateFrom);
    }

    if (req.query.dateTo) {
      const dateTo = new Date(req.query.dateTo);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= dateTo);
    }

    // Set appropriate headers based on format
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `audit_logs_${timestamp}`;

    switch (format) {
      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
        
        // Convert to CSV
        const csvHeader = 'ID,Action,User,Role,Timestamp,Details,Status,IP Address\n';
        const csvData = filteredLogs.map(log => 
          `${log.id},${log.action},${log.user},${log.role},${log.timestamp},${log.details},${log.status},${log.ipAddress}`
        ).join('\n');
        
        res.send(csvHeader + csvData);
        break;

      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
        res.json(filteredLogs);
        break;

      case 'pdf':
        // In a real implementation, you would generate PDF using a library like puppeteer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
        res.send('PDF export not implemented in demo version');
        break;
    }

    logger.info(`Audit logs exported in ${format} format by user: ${req.user.email}`);
  } catch (error) {
    logger.error('Audit export error:', error);
    ResponseFormatter.error(res, 'Audit export failed', 500, error.message);
  }
});

module.exports = router;
