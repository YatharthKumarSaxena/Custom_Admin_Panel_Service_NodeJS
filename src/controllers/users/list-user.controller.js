const { listUsersService } = require("@services/users/list-user.service");
const { logWithTime } = require("@utils/time-stamps.util");
const {
    throwBadRequestError,
    throwInternalServerError,
    getLogIdentifiers
} = require("@/responses/common/error-handler.response");
const { listUsersSuccessResponse } = require("@responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

const listUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            userType,
            isActive,
            isBlocked,
            firstName,
            sortBy,
            sortOrder
        } = req.query;

        // Call service with query parameters
        const result = await listUsersService({
            page: parseInt(page),
            limit: parseInt(limit),
            userType,
            isActive,
            isBlocked,
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
        return listUsersSuccessResponse(res, result.data);

    } catch (err) {
        logWithTime(`❌ Internal Error in listUsers controller ${getLogIdentifiers(req)}: ${err.message}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { listUsers };
