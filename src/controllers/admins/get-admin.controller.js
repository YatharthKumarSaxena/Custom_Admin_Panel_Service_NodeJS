const { getAdminService } = require("@services/admins/get-admin.service");
const { logWithTime } = require("@utils/time-stamps.util");
const {
    throwBadRequestError,
    throwInternalServerError,
    getLogIdentifiers,
    throwDBResourceNotFoundError
} = require("@/responses/common/error-handler.response");
const { getAdminSuccessResponse } = require("@responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

const getAdmin = async (req, res) => {
    try {
        const { adminId } = req.query;

        // Validate adminId
        if (!adminId) {
            logWithTime(`❌ adminId is required ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "adminId query parameter is required");
        }

        // Call service
        const result = await getAdminService(adminId);

        if (!result.success) {
            if (result.type === AdminErrorTypes.NOT_FOUND) {
                return throwDBResourceNotFoundError(res, "Admin", adminId);
            }
            if (result.type === AdminErrorTypes.INVALID_DATA) {
                return throwBadRequestError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Success response
        return getAdminSuccessResponse(res, result.data);

    } catch (err) {
        logWithTime(`❌ Internal Error in getAdmin controller ${getLogIdentifiers(req)}: ${err.message}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { getAdmin };
