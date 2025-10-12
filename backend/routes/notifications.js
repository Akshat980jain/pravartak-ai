const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * @swagger
 * /api/notifications/email:
 *   post:
 *     summary: Send email notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               template:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Validation error
 */
router.post('/email', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer', 'field_officer'),
  body('to').isEmail().withMessage('Valid email address is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('template').optional().isString().withMessage('Template must be a string'),
  body('data').optional().isObject().withMessage('Data must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const { to, subject, message, template, data } = req.body;

    // Create email transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@dbtportal.gov.in',
      to: to,
      subject: subject,
      html: message,
      text: message.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent to ${to} by user: ${req.user.email}, Message ID: ${info.messageId}`);

    ResponseFormatter.success(res, {
      messageId: info.messageId,
      to: to,
      subject: subject
    }, 'Email sent successfully');
  } catch (error) {
    logger.error('Email sending error:', error);
    ResponseFormatter.error(res, 'Email sending failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/notifications/sms:
 *   post:
 *     summary: Send SMS notification (mock)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: SMS sent successfully
 *       400:
 *         description: Validation error
 */
router.post('/sms', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer', 'field_officer'),
  body('to').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const { to, message } = req.body;

    // Mock SMS sending - in real implementation, this would call SMS API
    const smsResponse = {
      messageId: `SMS${Date.now()}${Math.floor(Math.random() * 1000)}`,
      to: to,
      message: message,
      status: 'sent',
      timestamp: new Date().toISOString()
    };

    // Simulate SMS API call
    await new Promise(resolve => setTimeout(resolve, 500));

    logger.info(`SMS sent to ${to} by user: ${req.user.email}, Message ID: ${smsResponse.messageId}`);

    ResponseFormatter.success(res, smsResponse, 'SMS sent successfully');
  } catch (error) {
    logger.error('SMS sending error:', error);
    ResponseFormatter.error(res, 'SMS sending failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/notifications/bulk:
 *   post:
 *     summary: Send bulk notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipients
 *               - type
 *               - subject
 *               - message
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     name:
 *                       type: string
 *               type:
 *                 type: string
 *                 enum: [email, sms, both]
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulk notifications sent successfully
 */
router.post('/bulk', [
  authMiddleware,
  roleMiddleware('admin', 'scheme_officer'),
  body('recipients').isArray({ min: 1 }).withMessage('At least one recipient is required'),
  body('type').isIn(['email', 'sms', 'both']).withMessage('Valid notification type is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const { recipients, type, subject, message } = req.body;

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      details: []
    };

    // Process each recipient
    for (const recipient of recipients) {
      try {
        if (type === 'email' || type === 'both') {
          if (recipient.email) {
            const transporter = createTransporter();
            const mailOptions = {
              from: process.env.FROM_EMAIL || 'noreply@dbtportal.gov.in',
              to: recipient.email,
              subject: subject,
              html: message,
              text: message.replace(/<[^>]*>/g, '')
            };
            
            const info = await transporter.sendMail(mailOptions);
            results.details.push({
              recipient: recipient.email,
              type: 'email',
              status: 'success',
              messageId: info.messageId
            });
            results.successful++;
          }
        }

        if (type === 'sms' || type === 'both') {
          if (recipient.mobile) {
            // Mock SMS sending
            const smsResponse = {
              messageId: `SMS${Date.now()}${Math.floor(Math.random() * 1000)}`,
              to: recipient.mobile,
              status: 'sent'
            };
            
            results.details.push({
              recipient: recipient.mobile,
              type: 'sms',
              status: 'success',
              messageId: smsResponse.messageId
            });
            results.successful++;
          }
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          recipient: recipient.email || recipient.mobile,
          type: type,
          status: 'failed',
          error: error.message
        });
      }
    }

    logger.info(`Bulk notifications sent: ${results.successful} successful, ${results.failed} failed by user: ${req.user.email}`);

    ResponseFormatter.success(res, results, 'Bulk notifications processed');
  } catch (error) {
    logger.error('Bulk notification error:', error);
    ResponseFormatter.error(res, 'Bulk notification failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/notifications/templates:
 *   get:
 *     summary: Get notification templates
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification templates retrieved successfully
 */
router.get('/templates', authMiddleware, async (req, res) => {
  try {
    // Mock notification templates - in real implementation, these would be stored in database
    const templates = [
      {
        id: 'application_approved',
        name: 'Application Approved',
        type: 'email',
        subject: 'Your DBT Application has been Approved',
        template: `
          <h2>Application Approved</h2>
          <p>Dear {{name}},</p>
          <p>We are pleased to inform you that your DBT application {{applicationId}} has been approved.</p>
          <p>Amount Sanctioned: ₹{{amount}}</p>
          <p>You will receive the payment within 7-10 working days.</p>
          <p>Thank you for using our services.</p>
        `,
        variables: ['name', 'applicationId', 'amount']
      },
      {
        id: 'payment_disbursed',
        name: 'Payment Disbursed',
        type: 'both',
        subject: 'Payment Disbursed to Your Account',
        template: `
          <h2>Payment Disbursed</h2>
          <p>Dear {{name}},</p>
          <p>Payment of ₹{{amount}} has been successfully disbursed to your account ending {{accountLast4}}.</p>
          <p>UTR Number: {{utrNumber}}</p>
          <p>Transaction Date: {{transactionDate}}</p>
          <p>Thank you for using our services.</p>
        `,
        variables: ['name', 'amount', 'accountLast4', 'utrNumber', 'transactionDate']
      },
      {
        id: 'grievance_resolved',
        name: 'Grievance Resolved',
        type: 'email',
        subject: 'Your Grievance has been Resolved',
        template: `
          <h2>Grievance Resolved</h2>
          <p>Dear {{name}},</p>
          <p>Your grievance {{grievanceId}} has been resolved.</p>
          <p>Resolution: {{resolution}}</p>
          <p>If you have any further concerns, please contact us.</p>
          <p>Thank you for your patience.</p>
        `,
        variables: ['name', 'grievanceId', 'resolution']
      }
    ];

    ResponseFormatter.success(res, templates, 'Notification templates retrieved successfully');
  } catch (error) {
    logger.error('Template retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve templates', 500, error.message);
  }
});

module.exports = router;
