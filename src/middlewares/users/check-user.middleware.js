const { throwInternalServerError, throwAccessDeniedError } = require("@/responses/common/error-handler.response");
const { isUserId } = require("@/utils/entity-type.util");
const { logMiddlewareError } = require("@/utils/log-error.util");
const { logWithTime } = require("@/utils/time-stamps.util");

const checkUserMiddleware = (req, res, next) => {
    try {

        const userId = req.body.userId; // This should be injected by the JWT verification middleware

        // Check if userId starts with User prefix
        if (!isUserId(userId)) {
            logMiddlewareError("checkUser", `User ID does not have user prefix: ${userId}`, req);
            return throwAccessDeniedError(res, "User privileges required");
        }

        logWithTime(`✅ User ID verified: ${userId}`);

        // If it passes the check, proceed to next middleware
        return next();
    } catch (err) {
        logMiddlewareError("checkUser", `Unexpected error: ${err.message}`, req);
        return throwInternalServerError(res, err);
    }
};

module.exports = { 
    checkUserMiddleware 
};