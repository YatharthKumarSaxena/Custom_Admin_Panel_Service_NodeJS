const { logWithTime } = require("@utils/time-stamps.util");
const { isValidCustomId } = require("@utils/id-validators.util");
const { getModelByType } = require("@services/common/get-model-by-type.service");
const { logServiceTrackerEvent } = require("@services/audit/service-tracker.service");
const { SYSTEM_LOG_EVENTS, STATUS_TYPES, SERVICE_NAMES } = require("@configs/system-log-events.config");
const { TotalTypes } = require("@configs/enums.config");

/**
 * Toggle Active Status Service
 * Updates isActive status for a user or admin
 * 
 * @param {string} userId - The custom user/admin ID (USR format)
 * @param {string} type - The entity type (TotalTypes.ADMIN, TotalTypes.USER, or TotalTypes.CLIENT)
 * @param {boolean} newIsActiveStatus - The new isActive status value
 * @param {string} executedBy - The adminId of who executed the action
 * @param {string} requestId - The request ID for tracking
 * @returns {Promise<Object>} - { success: boolean, message: string, data?: Object, type?: string }
 */
const toggleActiveStatusService = async (userId, type, newIsActiveStatus, executedBy, requestId) => {
  try {
    // Step 1: Validate userId format
    if (!userId || !isValidCustomId(userId)) {
      logWithTime(`❌ Invalid userId format: ${userId}`);
      
      logServiceTrackerEvent({
        serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
        eventType: SYSTEM_LOG_EVENTS.INTERNAL_API_CALL,
        action: "TOGGLE_ACTIVE_VALIDATION_FAILED",
        status: STATUS_TYPES.FAILURE,
        description: `Toggle active status failed: Invalid userId format (${userId})`,
        targetId: userId,
        executedBy: executedBy,
        metadata: { reason: "Invalid userId format", type, newIsActiveStatus }
      });

      return {
        success: false,
        type: "BadRequest",
        message: "Invalid userId format. Please provide a valid custom ID."
      };
    }

    // Step 2: Get the appropriate model based on type
    const Model = getModelByType(type);

    // Step 3: Determine the ID field name based on type
    const idField = type === TotalTypes.ADMIN ? "adminId" : "userId";

    // Step 4: Query for the user/admin (must not be deleted)
    const query = { [idField]: userId, isDeleted: false };
    
    logWithTime(`🔍 Searching for ${type} with ${idField}: ${userId}`);
    
    const userToUpdate = await Model.findOne(query).lean();

    // Step 5: Handle not found scenario
    if (!userToUpdate) {
      logWithTime(`⚠️ ${type} not found or already deleted: ${userId}`);
      
      logServiceTrackerEvent({
        serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
        eventType: SYSTEM_LOG_EVENTS.INTERNAL_API_CALL,
        action: "TOGGLE_ACTIVE_NOT_FOUND",
        status: STATUS_TYPES.FAILURE,
        description: `Toggle active status failed: ${type} not found with ${idField} ${userId}`,
        targetId: userId,
        executedBy: executedBy,
        metadata: { reason: "User not found", type, newIsActiveStatus }
      });

      return {
        success: false,
        type: "Conflict",
        message: `${type} not found or already deleted. Current isActive status: ${newIsActiveStatus}`
      };
    }

    // Step 6: Perform the update
    logWithTime(`🔄 Toggling active status for ${type}: ${userId} to ${newIsActiveStatus}`);
    
    const updateQuery = { [idField]: userId };
    const updateData = {
      isActive: newIsActiveStatus
    };
    
    const updatedUser = await Model.findOneAndUpdate(
      updateQuery,
      updateData,
      { new: true, lean: true }
    );

    // Step 7: Log success to ServiceTracker
    const action = newIsActiveStatus ? "ACTIVATE_USER" : "DEACTIVATE_USER";
    logWithTime(`✅ Successfully toggled active status for ${type}: ${userId}`);
    
    logServiceTrackerEvent({
      serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
      eventType: SYSTEM_LOG_EVENTS.INTERNAL_API_CALL,
      action: action,
      status: STATUS_TYPES.SUCCESS,
      description: `${type} ${newIsActiveStatus ? "activated" : "deactivated"} with ${idField} ${userId}`,
      targetId: userId,
      executedBy: executedBy,
      metadata: { 
        type,
        idField,
        isActive: updatedUser.isActive
      }
    });

    return {
      success: true,
      data: updatedUser,
      message: `${type} ${newIsActiveStatus ? "activated" : "deactivated"} successfully.`
    };

  } catch (err) {
    logWithTime(`💥 Error in toggleActiveStatusService: ${err.message}`);
    
    // Log the error to ServiceTracker
    logServiceTrackerEvent({
      serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
      eventType: SYSTEM_LOG_EVENTS.SYSTEM_ERROR,
      action: "TOGGLE_ACTIVE_ERROR",
      status: STATUS_TYPES.ERROR,
      description: `Unexpected error during toggle active status: ${err.message}`,
      targetId: userId || "unknown",
      executedBy: executedBy,
      metadata: { 
        error: err.message,
        type,
        newIsActiveStatus,
        stack: err.stack
      }
    });

    return {
      success: false,
      type: "InternalServerError",
      message: err.message || "An error occurred while toggling active status."
    };
  }
};

module.exports = {
  toggleActiveStatusService
};
