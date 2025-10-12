const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const ResponseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const encryption = require('../utils/encryption');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - mobile
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           description: User's email address
 *         mobile:
 *           type: string
 *           description: User's mobile number
 *         role:
 *           type: string
 *           enum: [admin, scheme_officer, field_officer, beneficiary, auditor]
 *           description: User's role in the system
 *         isActive:
 *           type: boolean
 *           description: Whether the user account is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - mobile
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, scheme_officer, field_officer, beneficiary, auditor]
 *               aadhaar:
 *                 type: string
 *               address:
 *                 type: object
 *               department:
 *                 type: string
 *               designation:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               jurisdiction:
 *                 type: object
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['admin', 'scheme_officer', 'field_officer', 'beneficiary', 'auditor']).withMessage('Valid role is required'),
  body('aadhaar').optional().matches(/^\d{12}$/).withMessage('Valid 12-digit Aadhaar number is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      role,
      aadhaar,
      address,
      department,
      designation,
      employeeId,
      jurisdiction
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }, ...(aadhaar ? [{ aadhaar }] : [])]
    });

    if (existingUser) {
      return ResponseFormatter.error(res, 'User already exists with this email, mobile, or Aadhaar', 409);
    }

    // Create user
    const userData = {
      firstName,
      lastName,
      email,
      mobile,
      password,
      role,
      ...(aadhaar && { aadhaar }),
      ...(address && { address }),
      ...(department && { department }),
      ...(designation && { designation }),
      ...(employeeId && { employeeId }),
      ...(jurisdiction && { jurisdiction }),
      createdBy: req.user?.id || null
    };

    const user = await User.create(userData);

    // Generate email verification token
    const emailVerificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Log registration
    logger.info(`New user registered: ${user.email} with role: ${user.role}`);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;

    ResponseFormatter.success(res, userResponse, 'User registered successfully', 201);
  } catch (error) {
    logger.error('Registration error:', error);
    ResponseFormatter.error(res, 'Registration failed', 500, error.message);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const { email, password } = req.body;

    // Find user and check password
    const user = await User.findByCredentials(email, password);

    // Check if user is approved (for officers)
    if (['scheme_officer', 'field_officer'].includes(user.role) && !user.isApproved) {
      return ResponseFormatter.error(res, 'Account pending approval from administrator', 403);
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const token = user.signToken();
    const refreshToken = user.signRefreshToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;

    logger.info(`User logged in: ${user.email}`);

    ResponseFormatter.success(res, {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRE || '1h'
    }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    ResponseFormatter.error(res, error.message, 401);
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    logger.info(`User logged out: ${req.user.email}`);

    ResponseFormatter.success(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error:', error);
    ResponseFormatter.error(res, 'Logout failed', 500);
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return ResponseFormatter.notFound(res, 'User not found');
    }

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.passwordResetToken;
    delete userResponse.passwordResetExpires;
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;

    ResponseFormatter.success(res, userResponse, 'Profile retrieved successfully');
  } catch (error) {
    logger.error('Profile retrieval error:', error);
    ResponseFormatter.error(res, 'Failed to retrieve profile', 500);
  }
});

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid current password
 */
router.put('/update-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseFormatter.validationError(res, errors.array());
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.correctPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return ResponseFormatter.error(res, 'Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    logger.info(`Password updated for user: ${user.email}`);

    ResponseFormatter.success(res, null, 'Password updated successfully');
  } catch (error) {
    logger.error('Password update error:', error);
    ResponseFormatter.error(res, 'Password update failed', 500);
  }
});

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return ResponseFormatter.unauthorized(res, 'Refresh token not provided');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return ResponseFormatter.unauthorized(res, 'Invalid token type');
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return ResponseFormatter.unauthorized(res, 'User not found or inactive');
    }

    // Generate new access token
    const newToken = user.signToken();

    ResponseFormatter.success(res, {
      token: newToken,
      expiresIn: process.env.JWT_EXPIRE || '1h'
    }, 'Token refreshed successfully');
  } catch (error) {
    logger.error('Token refresh error:', error);
    ResponseFormatter.unauthorized(res, 'Invalid refresh token');
  }
});

module.exports = router;
