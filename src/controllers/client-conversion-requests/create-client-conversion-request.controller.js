const { createClientConversionRequestService } = require("@/services/client-conversion-requests/create-client-conversion-request.service");
const { CREATED, BAD_REQUEST, CONFLICT, NOT_FOUND, UNAUTHORIZED } = require("@/configs/http-status.config");
const {
    throwBadRequestError,
    throwConflictError,
    throwDBResourceNotFoundError,
    throwUnauthorizedError,
    throwInternalServerError,
    throwSpecificInternalServerError
} = require("@/responses/common/error-handler.response");
const { createClientConversionRequestSuccessResponse } = require("@/responses/success/client-conversion-request.response");
const { logWithTime } = require("@/utils/time-stamps.util");

const createClientConversionRequestController = async (req, res) => {
    try {
        const admin = req.admin;
        const user = req.foundUser;
        const {
            requestType,
            conversionReason,
            reasonDescription,
            organizations = [],
            newOrganizations = []
        } = req.body;

        const result = await createClientConversionRequestService(
            admin,
            {
                user,
                requestType,
                conversionReason,
                reasonDescription,
                organizations,
                newOrganizations
            },
            req.device,
            req.requestId
        );

        if (!result.success) {
            if (result.errorCode === BAD_REQUEST) {
                return throwBadRequestError(res, result.message);
            }

            if (result.errorCode === CONFLICT) {
                return throwConflictError(res, result.message);
            }

            if (result.errorCode === NOT_FOUND) {
                return throwDBResourceNotFoundError(res, result.message);
            }

            if (result.errorCode === UNAUTHORIZED) {
                return throwUnauthorizedError(res, "ClientConversionRequest", result.message);
            }

            return throwSpecificInternalServerError(res, result.message);
        }

        if (result.errorCode !== CREATED) {
            return throwSpecificInternalServerError(res, "Unexpected response from create client conversion request service");
        }

        return createClientConversionRequestSuccessResponse(res, result.data, result.message);
    } catch (error) {
        logWithTime(`❌ createClientConversionRequestController error: ${error.message}`);
        return throwInternalServerError(res, error);
    }
};

module.exports = {
    createClientConversionRequestController
};
