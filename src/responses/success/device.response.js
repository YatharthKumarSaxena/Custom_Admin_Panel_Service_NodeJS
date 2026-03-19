// DEVICE SUCCESS RESPONSES

const { OK } = require("@/configs/http-status.config");

const blockDeviceSuccessResponse = (res, device) => {
    return res.status(OK).json({
        success: true,
        message: "Device successfully blocked.",
        data: {
            deviceUUID: device.deviceUUID,
            deviceType: device.deviceType,
            isBlocked: device.isBlocked,
            blockedAt: device.blockedAt,
            blockedBy: device.blockedBy,
            blockReason: device.blockReason,
            blockReasonDetails: device.blockReasonDetails,
            blockCount: device.blockCount
        }
    });
};

const unblockDeviceSuccessResponse = (res, device) => {
    return res.status(OK).json({
        success: true,
        message: "Device successfully unblocked.",
        data: {
            deviceUUID: device.deviceUUID,
            deviceType: device.deviceType,
            isBlocked: device.isBlocked,
            unblockedAt: device.unblockedAt,
            unblockedBy: device.unblockedBy,
            unblockReason: device.unblockReason,
            unblockReasonDetails: device.unblockReasonDetails
        }
    });
};

const deviceSuccessResponses = {
    blockDeviceSuccessResponse,
    unblockDeviceSuccessResponse
};

module.exports = {
    deviceSuccessResponses
};
