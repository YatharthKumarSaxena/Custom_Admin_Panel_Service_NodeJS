const { throwInternalServerError, logMiddlewareError, throwAccessDeniedError } = require("@/responses/common/error-handler.response");
const { logWithTime } = require("@utils/time-stamps.util");

// Checking if user Account is Active
const isUserAccountActive = async (req, res, next) => {
    try {
        const user = req.admin || req.user || req.foundUser || req.foundAdmin;
        if (user.isActive === false) {
            logMiddlewareError("isUserAccountActive", "User account is deactivated", req);
            return throwAccessDeniedError(res, "Your account has been deactivated. Please activate your account before continuing.");
        }
        const id = user.userId || user.adminId || "Unknown ID";
        logWithTime(`✅ User (${id}) account is active`);
        // Active user – Allow to proceed
        return next();
    } catch (err) {
        logMiddlewareError("isUserAccountActive", "Internal error during user active check", req);
        return throwInternalServerError(res, err);
    }
}

module.exports = {
    isUserAccountActive
}