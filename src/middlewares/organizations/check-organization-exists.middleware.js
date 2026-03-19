const { OrganizationModel } = require("@/models/organization.model");
const { throwInternalServerError, throwDBResourceNotFoundError, logMiddlewareError, throwMissingFieldsError, throwValidationError } = require("@/responses/common/error-handler.response");
const { isValidMongoID } = require("@/utils/id-validators.util");
const { logWithTime } = require("@/utils/time-stamps.util");

const checkOrganizationExistsMiddleware = async (req, res, next) => {
    try { 
        const organizationId = req?.params?.organizationId || req?.body?.organizationId;
        if (!organizationId) {
            logMiddlewareError("checkOrganizationExists", "Organization ID is missing in request", req);
            return throwMissingFieldsError(res, "Organization ID is required");
        }
        if (!isValidMongoID(organizationId)) {
            logMiddlewareError("checkOrganizationExists", "Invalid Organization ID format", req);
            return throwValidationError(res, ["Invalid Organization ID format"]);
        }
        const organizationExists = await OrganizationModel.findOne({ _id: organizationId, deletedAt: null }).lean();
        if (!organizationExists) {
            logMiddlewareError("checkOrganizationExists", "Organization not found for organizationId: " + organizationId, req);
            return throwDBResourceNotFoundError(res, "Organization");
        }
        logWithTime("✅ Organization exists for organizationId: " + organizationId);
        // Attach organization to request for use in controller
        req.organization = organizationExists;
        return next();
    } catch (error) {
        logMiddlewareError("checkOrganizationExists", "An error occurred while checking organization existence: " + error.message, req);
        return throwInternalServerError(res, error);
    }
}

module.exports = {
    checkOrganizationExistsMiddleware
}