const { CREATED } = require("@/configs/http-status.config");

const createClientConversionRequestSuccessResponse = (res, request, message = "Client conversion request created successfully.") => {
    return res.status(CREATED).json({
        success: true,
        message,
        data: {
            requestId: request._id,
            userId: request.userId,
            requestType: request.requestType,
            status: request.status,
            conversionReason: request.conversionReason,
            reasonDescription: request.reasonDescription,
            existingOrganizations: request.existingOrganizations,
            newOrganizations: request.newOrganizations,
            createdAt: request.createdAt
        }
    });
};

module.exports = {
    createClientConversionRequestSuccessResponse
};
