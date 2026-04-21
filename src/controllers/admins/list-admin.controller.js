const { listAdminService } = require("@services/admins/list-admin.service");
const { logWithTime } = require("@utils/time-stamps.util");
const {
    throwBadRequestError,
    throwInternalServerError,
    getLogIdentifiers
} = require("@/responses/common/error-handler.response");
const { listAdminSuccessResponse } = require("@responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

const listAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            adminType,
            isActive,
            isBlocked,
            isSuspended,
            firstName,
            sortBy,
            sortOrder
        } = req.query;

        // Call service with query parameters
        const result = await listAdminService({
            page: parseInt(page),
            limit: parseInt(limit),
            adminType,
            isActive,
            isBlocked,
            isSuspended,
            firstName,
            sortBy,
            sortOrder: sortOrder ? parseInt(sortOrder) : -1
        });

        if (!result.success) {
            if (result.type === AdminErrorTypes.INVALID_DATA) {
                return throwBadRequestError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Success response
        return listAdminSuccessResponse(res, result.data);

    } catch (err) {
        logWithTime(`❌ Internal Error in listAdmin controller ${getLogIdentifiers(req)}: ${err.message}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { listAdmin };
