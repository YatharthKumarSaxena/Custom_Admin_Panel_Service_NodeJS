// USER SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");

const blockUserSuccessResponse = (res, user) => {
    return res.status(OK).json({
        success: true,
        message: "User successfully blocked.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            isBlocked: user.isBlocked,
            blockedAt: user.blockedAt,
            blockedBy: user.blockedBy,
            blockReason: user.blockReason,
            blockCount: user.blockCount
        }
    });
};

const unblockUserSuccessResponse = (res, user) => {
    return res.status(OK).json({
        success: true,
        message: "User successfully unblocked.",
        data: {
            userId: user.userId,
            firstName: user.firstName,
            isBlocked: user.isBlocked,
            unblockedAt: user.unblockedAt,
            unblockedBy: user.unblockedBy,
            unblockReason: user.unblockReason
        }
    });
};

const listUsersSuccessResponse = (res, data) => {
    return res.status(OK).json({
        success: true,
        message: "Users retrieved successfully.",
        data: data
    });
};

const getUserSuccessResponse = (res, user) => {
    return res.status(OK).json({
        success: true,
        message: "User retrieved successfully.",
        data: user
    });
};

const userSuccessResponses = {
    blockUserSuccessResponse,
    unblockUserSuccessResponse,
    listUsersSuccessResponse,
    getUserSuccessResponse
};

module.exports = {
    userSuccessResponses
};
