const express = require('express');
const { param, validationResult } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/integration/aadhaar/{number}:
 *   get:
 *     summary: Aadhaar verification (mock)
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{12}$'
 *         description: 12-digit Aadhaar number
 *     responses:
 *       200:
 *         description: Aadhaar verification successful
 *       400:
 *         description: Invalid Aadhaar number
 */
router.get('/aadhaar/:number', [
  authMiddleware,
  roleMiddleware('field_officer', 'scheme_officer', 'admin'),
  param('number').matches(/^\d{12}$/).withMessage('Valid 12-digit Aadhaar number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const aadhaarNumber = req.params.number;

    // Mock Aadhaar verification - in real implementation, this would call UIDAI API
    const mockResponse = {
      aadhaarNumber,
      isValid: true,
      name: 'Rajesh Kumar',
      gender: 'Male',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      verificationStatus: 'verified',
      verificationDate: new Date().toISOString(),
      responseCode: '200',
      responseMessage: 'Aadhaar verification successful'
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`Aadhaar verification requested for: ${aadhaarNumber} by user: ${req.user.email}`);

    ResponseFormatter.success(res, mockResponse, 'Aadhaar verification successful');
  } catch (error) {
    logger.error('Aadhaar verification error:', error);
    ResponseFormatter.error(res, 'Aadhaar verification failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/integration/ecourts/{caseId}:
 *   get:
 *     summary: eCourts case verification (mock)
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Case ID from eCourts
 *     responses:
 *       200:
 *         description: Case verification successful
 *       404:
 *         description: Case not found
 */
router.get('/ecourts/:caseId', [
  authMiddleware,
  roleMiddleware('field_officer', 'scheme_officer', 'admin'),
  param('caseId').notEmpty().withMessage('Case ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const caseId = req.params.caseId;

    // Mock eCourts verification - in real implementation, this would call eCourts API
    const mockResponse = {
      caseId,
      caseNumber: 'PCR/2024/001234',
      caseTitle: 'State vs. Accused Name',
      caseType: 'PCR',
      courtName: 'Sessions Court, Mumbai',
      caseStatus: 'Under Trial',
      filingDate: '2024-01-15',
      lastHearingDate: '2024-12-10',
      nextHearingDate: '2025-01-15',
      parties: [
        {
          name: 'Rajesh Kumar',
          type: 'Victim',
          address: '123 Main Street, Mumbai'
        },
        {
          name: 'Accused Name',
          type: 'Accused',
          address: '456 Other Street, Mumbai'
        }
      ],
      caseDetails: {
        incidentDate: '2023-12-01',
        incidentLocation: 'Mumbai',
        policeStation: 'Mumbai Police Station',
        firNumber: 'FIR/2023/1234',
        sections: ['IPC 323', 'IPC 506', 'PCR Act 3(1)(x)']
      },
      verificationStatus: 'verified',
      verificationDate: new Date().toISOString()
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    logger.info(`eCourts case verification requested for: ${caseId} by user: ${req.user.email}`);

    ResponseFormatter.success(res, mockResponse, 'Case verification successful');
  } catch (error) {
    logger.error('eCourts verification error:', error);
    ResponseFormatter.error(res, 'Case verification failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/integration/cctns/{crimeId}:
 *   get:
 *     summary: CCTNS crime data fetch (mock)
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Crime ID from CCTNS
 *     responses:
 *       200:
 *         description: Crime data retrieved successfully
 *       404:
 *         description: Crime record not found
 */
router.get('/cctns/:crimeId', [
  authMiddleware,
  roleMiddleware('field_officer', 'scheme_officer', 'admin'),
  param('crimeId').notEmpty().withMessage('Crime ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const crimeId = req.params.crimeId;

    // Mock CCTNS data - in real implementation, this would call CCTNS API
    const mockResponse = {
      crimeId,
      firNumber: 'FIR/2023/1234',
      crimeType: 'Atrocity',
      incidentDate: '2023-12-01',
      incidentTime: '14:30:00',
      incidentLocation: {
        address: '123 Main Street',
        area: 'Andheri',
        city: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      policeStation: {
        name: 'Andheri Police Station',
        code: 'MUM001',
        district: 'Mumbai',
        state: 'Maharashtra'
      },
      victims: [
        {
          name: 'Rajesh Kumar',
          age: 38,
          gender: 'Male',
          caste: 'SC',
          address: '123 Main Street, Mumbai',
          contactNumber: '9876543210'
        }
      ],
      accused: [
        {
          name: 'Accused Name',
          age: 35,
          gender: 'Male',
          address: '456 Other Street, Mumbai',
          status: 'Arrested'
        }
      ],
      caseStatus: 'Under Investigation',
      investigationOfficer: {
        name: 'Inspector John Doe',
        badge: 'INS001',
        contactNumber: '9876543211'
      },
      caseDetails: {
        description: 'Atrocity case under PCR Act',
        sections: ['IPC 323', 'IPC 506', 'PCR Act 3(1)(x)'],
        evidence: ['Medical Certificate', 'Witness Statements', 'Photographs']
      },
      lastUpdated: '2024-12-10T10:30:00Z',
      verificationStatus: 'verified',
      verificationDate: new Date().toISOString()
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    logger.info(`CCTNS data fetch requested for: ${crimeId} by user: ${req.user.email}`);

    ResponseFormatter.success(res, mockResponse, 'Crime data retrieved successfully');
  } catch (error) {
    logger.error('CCTNS data fetch error:', error);
    ResponseFormatter.error(res, 'Crime data fetch failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/integration/pfms/verify:
 *   post:
 *     summary: PFMS account verification (mock)
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - ifscCode
 *             properties:
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *               accountHolderName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verification successful
 *       400:
 *         description: Invalid account details
 */
router.post('/pfms/verify', [
  authMiddleware,
  roleMiddleware('scheme_officer', 'admin')
], async (req, res) => {
  try {
    const { accountNumber, ifscCode, accountHolderName } = req.body;

    if (!accountNumber || !ifscCode) {
      return ResponseFormatter.error(res, 'Account number and IFSC code are required', 400);
    }

    // Mock PFMS verification - in real implementation, this would call PFMS API
    const mockResponse = {
      accountNumber,
      ifscCode,
      accountHolderName: accountHolderName || 'Rajesh Kumar',
      bankName: 'State Bank of India',
      branchName: 'Andheri Branch',
      branchAddress: 'Andheri West, Mumbai',
      accountType: 'Savings',
      accountStatus: 'Active',
      verificationStatus: 'verified',
      verificationDate: new Date().toISOString(),
      responseCode: '200',
      responseMessage: 'Account verification successful'
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    logger.info(`PFMS account verification requested for: ${accountNumber} by user: ${req.user.email}`);

    ResponseFormatter.success(res, mockResponse, 'Account verification successful');
  } catch (error) {
    logger.error('PFMS verification error:', error);
    ResponseFormatter.error(res, 'Account verification failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/integration/status:
 *   get:
 *     summary: Get integration services status
 *     tags: [Integration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Integration services status retrieved successfully
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    // Mock integration status - in real implementation, this would check actual service status
    const integrationStatus = {
      services: [
        {
          name: 'UIDAI Aadhaar',
          status: 'operational',
          responseTime: '1.2s',
          lastChecked: new Date().toISOString(),
          uptime: '99.9%'
        },
        {
          name: 'eCourts',
          status: 'operational',
          responseTime: '2.1s',
          lastChecked: new Date().toISOString(),
          uptime: '98.5%'
        },
        {
          name: 'CCTNS',
          status: 'operational',
          responseTime: '1.8s',
          lastChecked: new Date().toISOString(),
          uptime: '99.2%'
        },
        {
          name: 'PFMS',
          status: 'operational',
          responseTime: '1.5s',
          lastChecked: new Date().toISOString(),
          uptime: '99.7%'
        }
      ],
      overallStatus: 'operational',
      lastUpdated: new Date().toISOString()
    };

    ResponseFormatter.success(res, integrationStatus, 'Integration services status retrieved successfully');
  } catch (error) {
    logger.error('Integration status error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve integration status', 500, error.message);
  }
});

module.exports = router;
