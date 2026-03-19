const { OrganizationUserModel } = require("@models/organizational-user.model");
const { throwInternalServerError, throwDBResourceNotFoundError, logMiddlewareError, throwMissingFieldsError, throwValidationError } = require("@/responses/common/error-handler.response");
const { isValidMongoID } = require("@/utils/id-validators.util");
const { logWithTime } = require("@/utils/time-stamps.util");

const checkOrganizationUserExistsMiddleware = async (req, res, next) => {
    try { 
        const orgUserId = req?.params?.orgUserId || req?.body?.orgUserId;
        if (!orgUserId) {
            logMiddlewareError("checkOrganizationUserExists", "Organization User ID is missing in request", req);
            return throwMissingFieldsError(res, "Organization User ID is required");
        }
        if (!isValidMongoID(orgUserId)) {
            logMiddlewareError("checkOrganizationUserExists", "Invalid Organization User ID format", req);
            return throwValidationError(res, ["Invalid Organization User ID format"]);
        }
        const organizationUserExists = await OrganizationUserModel.findOne({ _id: orgUserId, deletedAt: null }).lean();
        if (!organizationUserExists) {
            logMiddlewareError("checkOrganizationUserExists", "Organization user not found for orgUserId: " + orgUserId, req);
            return throwDBResourceNotFoundError(res, "Organization User");
        }
        logWithTime("✅ Organization user exists for orgUserId: " + orgUserId);
        // Attach organization user to request for use in controller
        req.orgUser = organizationUserExists;
        return next();
    } catch (error) {
        logMiddlewareError("checkOrganizationUserExists", "An error occurred while checking organization user existence: " + error.message, req);
        return throwInternalServerError(res, error);
    }
}

module.exports = {
    checkOrganizationUserExistsMiddleware
}