// ADMIN SUCCESS RESPONSES

const { OK, CREATED } = require("@/configs/http-status.config");

const createAdminSuccessResponse = (res, admin) => {
    return res.status(CREATED).json({
        success: true,
        message: "Admin created successfully.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            adminType: admin.adminType,
            supervisorId: admin.supervisorId,
            isActive: admin.isActive,
            createdAt: admin.createdAt
        }
    });
};

const createUserSuccessResponse = (res, user) => {
    return res.status(CREATED).json({
        success: true,
        message: "Client created successfully.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            userType: user.userType,
            clientStatus: user.clientStatus,
            convertedToClientBy: user.convertedToClientBy,
            convertedToClientAt: user.convertedToClientAt,
            isActive: user.isActive,
            createdAt: user.createdAt
        }
    });
};

const adminSuccessResponses = {
    createAdminSuccessResponse,
    createUserSuccessResponse
}

module.exports = {
    adminSuccessResponses
}