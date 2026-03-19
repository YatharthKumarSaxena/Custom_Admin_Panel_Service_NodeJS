const { unblockDeviceService } = require("@services/devices/unblock-device.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwBadRequestError, 
  throwInternalServerError, 
  getLogIdentifiers, 
  throwConflictError,
  throwUnauthorizedError,
  throwSpecificInternalServerError
} = require("@/responses/common/error-handler.response");
const { unblockDeviceSuccessResponse } = require("@responses/success/index");
const { AdminErrorTypes } = require("@configs/enums.config");

const unblockDevice = async (req, res) => {
  try {
    const updater = req.admin; // Injected by middleware
    const { deviceUUID, unblockReason, reasonDescription } = req.body;

    // Call service
    const result = await unblockDeviceService(
      updater,
      deviceUUID,
      unblockReason,
      reasonDescription,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      if (result.type === AdminErrorTypes.UNAUTHORIZED) {
        return throwUnauthorizedError(res, result.message);
      }
      if (result.type === AdminErrorTypes.ALREADY_UNBLOCKED) {
        return throwConflictError(res, result.message);
      }
      if (result.type === AdminErrorTypes.CONFLICT) {
        return throwConflictError(res, result.message);
      }
      if (result.type === AdminErrorTypes.INVALID_DATA) {
        return throwBadRequestError(res, result.message);
      }
      return throwSpecificInternalServerError(res, result.message);
    }

    logWithTime(`✅ Device unblocked successfully: ${deviceUUID} by ${updater.adminId}`);
    // Success response
    return unblockDeviceSuccessResponse(res, result.data);

  } catch (err) {
    logWithTime(`❌ Internal Error in unblockDevice controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { unblockDevice };
