const { getUserService } = require("@services/users/get-user.service");
const { logWithTime } = require("@utils/time-stamps.util");
const {
    throwBadRequestError,
    throwInternalServerError,
    getLogIdentifiers,
    throwDBResourceNotFoundError
} = require("@/responses/common/error-handler.response");
const { getUserSuccessResponse } = require("@responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

const getUser = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate userId
        if (!userId) {
            logWithTime(`❌ userId is required ${getLogIdentifiers(req)}`);
            return throwBadRequestError(res, "userId query parameter is required");
        }

        // Call service
        const result = await getUserService(userId);

        if (!result.success) {
            if (result.type === AdminErrorTypes.NOT_FOUND) {
                return throwDBResourceNotFoundError(res, "User", userId);
            }
            if (result.type === AdminErrorTypes.INVALID_DATA) {
                return throwBadRequestError(res, result.message);
            }
            return throwInternalServerError(res, result.message);
        }

        // Success response
        return getUserSuccessResponse(res, result.data);

    } catch (err) {
        logWithTime(`❌ Internal Error in getUser controller ${getLogIdentifiers(req)}: ${err.message}`);
        return throwInternalServerError(res, err);
    }
};

module.exports = { getUser };
