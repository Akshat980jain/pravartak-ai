const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const ResponseFormatter = require('../utils/responseFormatter');

/**
 * Authentication middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ResponseFormatter.unauthorized(res, 'Access denied. No token provided.');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return ResponseFormatter.unauthorized(res, 'Token is not valid. User not found.');
      }

      if (!user.isActive) {
        return ResponseFormatter.unauthorized(res, 'Account is deactivated.');
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error);
      return ResponseFormatter.unauthorized(res, 'Token is not valid.');
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return ResponseFormatter.error(res, 'Authentication failed', 500);
  }
};

/**
 * Role-based authorization middleware
 * @param {array} roles - Allowed roles
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseFormatter.unauthorized(res, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user._id} with role ${req.user.role}`);
      return ResponseFormatter.forbidden(res, 'Access denied. Insufficient permissions.');
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        logger.warn('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Admin only middleware
 */
const adminOnly = roleMiddleware('admin');

/**
 * Officer only middleware (Scheme Officer, Field Officer)
 */
const officerOnly = roleMiddleware('scheme_officer', 'field_officer');

/**
 * Beneficiary only middleware
 */
const beneficiaryOnly = roleMiddleware('beneficiary');

/**
 * Auditor only middleware
 */
const auditorOnly = roleMiddleware('auditor');

module.exports = {
  authMiddleware,
  roleMiddleware,
  optionalAuth,
  adminOnly,
  officerOnly,
  beneficiaryOnly,
  auditorOnly
};
