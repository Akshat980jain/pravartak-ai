/**
 * Standardized API response formatter
 */
class ResponseFormatter {
  /**
   * Success response
   * @param {object} res - Express response object
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @returns {object} - Formatted response
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} error - Error details
   * @returns {object} - Formatted response
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   * @param {object} res - Express response object
   * @param {array} errors - Validation errors
   * @returns {object} - Formatted response
   */
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Unauthorized response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @returns {object} - Formatted response
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Forbidden response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @returns {object} - Formatted response
   */
  static forbidden(res, message = 'Forbidden access') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Not found response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @returns {object} - Formatted response
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Paginated response
   * @param {object} res - Express response object
   * @param {array} data - Response data
   * @param {object} pagination - Pagination info
   * @param {string} message - Success message
   * @returns {object} - Formatted response
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit)
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseFormatter;
