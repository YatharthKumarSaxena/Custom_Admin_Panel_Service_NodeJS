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

const convertUserToClientSuccessResponse = (res, user) => {
    return res.status(OK).json({
        success: true,
        message: "User successfully converted to client.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            userType: user.userType,
            clientStatus: user.clientStatus,
            convertedToClientBy: user.convertedToClientBy,
            convertedToClientAt: user.convertedToClientAt
        }
    });
};

const blockAdminSuccessResponse = (res, admin) => {
    return res.status(OK).json({
        success: true,
        message: "Admin successfully blocked.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            isBlocked: admin.isBlocked,
            blockedAt: admin.blockedAt,
            blockedBy: admin.blockedBy,
            lastBlockReason: admin.lastBlockReason
        }
    });
};

const unblockAdminSuccessResponse = (res, admin) => {
    return res.status(OK).json({
        success: true,
        message: "Admin successfully unblocked.",
        data: {
            adminId: admin.adminId,
            firstName: admin.firstName,
            isBlocked: admin.isBlocked,
            unblockedAt: admin.unblockedAt,
            unblockedBy: admin.unblockedBy,
            lastUnblockReason: admin.lastUnblockReason
        }
    });
};

const adminSuccessResponses = {
    createAdminSuccessResponse,
    createUserSuccessResponse,
    convertUserToClientSuccessResponse,
    blockAdminSuccessResponse,
    unblockAdminSuccessResponse
}

module.exports = {
    adminSuccessResponses
}