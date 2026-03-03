const { verifyAndValidateServiceToken } = require("@utils/service-token-verifier.util");
const { SERVICE_HEADERS } = require("@configs/headers.config");
const { UNAUTHORIZED, FORBIDDEN } = require("@configs/http-status.config");
const { logWithTime } = require("@utils/time-stamps.util");

/**
 * Middleware factory for verifying service tokens from other microservices
 * 
 * Usage:
 * - Basic: router.use(verifyServiceToken())
 * - Restrict to specific services: router.use(verifyServiceToken(['auth-service', 'payment-service']))
 * 
 * On success:
 * - Attaches `req.serviceAuth` with decoded token data: { serviceName, serviceInstanceId, type, iat, exp }
 * 
 * On failure:
 * - Returns 401 if token is missing, invalid, or expired
 * - Returns 403 if service is not in allowed list
 * 
 * @param {Array<string>} allowedServices - Optional array of allowed service names
 * @returns {Function} Express middleware function
 */
const verifyServiceToken = (allowedServices = null) => {
  return (req, res, next) => {
    try {
      // Extract token from header
      const token = req.headers[SERVICE_HEADERS.SERVICE_TOKEN];

      if (!token) {
        logWithTime(`⚠️ Service token missing in request to ${req.path}`);
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: "Service token is required for this endpoint",
          error: "MISSING_SERVICE_TOKEN"
        });
      }

      // Verify and validate token
      const result = verifyAndValidateServiceToken(token, allowedServices);

      if (!result.success) {
        const statusCode = result.error?.includes("not in the allowed") 
          ? FORBIDDEN 
          : UNAUTHORIZED;

        logWithTime(`❌ Service token verification failed: ${result.error}`);

        return res.status(statusCode).json({
          success: false,
          message: result.error,
          error: result.error?.includes("expired") 
            ? "TOKEN_EXPIRED" 
            : result.error?.includes("not in the allowed")
            ? "SERVICE_NOT_ALLOWED"
            : "INVALID_SERVICE_TOKEN"
        });
      }

      // Attach decoded token to request
      req.serviceAuth = {
        serviceName: result.decoded.serviceName,
        serviceInstanceId: result.decoded.serviceInstanceId,
        type: result.decoded.type,
        issuedAt: result.decoded.iat,
        expiresAt: result.decoded.exp
      };

      logWithTime(
        `🔐 Service authenticated: ${req.serviceAuth.serviceName} → ${req.method} ${req.path}`
      );

      next();

    } catch (err) {
      logWithTime(`❌ Service token middleware error: ${err.message}`);
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: "Service authentication failed",
        error: "AUTHENTICATION_ERROR"
      });
    }
  };
};

/**
 * Middleware to verify service token and restrict to specific service names
 * 
 * Usage:
 * router.post('/internal/sync', restrictToServices(['auth-service']), controller)
 * 
 * @param {Array<string>} requiredServices - Array of allowed service names
 * @returns {Function} Express middleware function
 */
const restrictToServices = (requiredServices = []) => {
  if (!Array.isArray(requiredServices) || requiredServices.length === 0) {
    throw new Error("restrictToServices requires a non-empty array of service names");
  }

  return verifyServiceToken(requiredServices);
};

/**
 * Middleware helper to check if request is from a specific service
 * Must be used AFTER verifyServiceToken middleware
 * 
 * Usage in controller:
 * if (isFromService(req, 'auth-service')) { ... }
 * 
 * @param {Object} req - Express request object
 * @param {string} serviceName - Service name to check
 * @returns {boolean} True if request is from the specified service
 */
const isFromService = (req, serviceName) => {
  return req.serviceAuth?.serviceName === serviceName;
};

module.exports = {
  verifyServiceToken,
  restrictToServices,
  isFromService
};
