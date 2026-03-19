const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { OrganizationUserModel } = require("@/models/organizational-user.model");
const { OrganizationUserErrorTypes } = require("@/configs/service-error.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Disable Organization User Service (Set isActive: false)
 * @param {Object} updaterAdmin - The admin disabling the org user
 * @param {string} orgUserId - Organization User ID
 * @param {Object} oldOrgUser - Old org user data
 * @param {Object} device - Device object
 * @param {string} requestId - Request ID for tracking
 * @param {string} disablitionReason - Reason for disabling
 * @param {string} reasonDescription - Optional description of the reason
 * @returns {Promise<{success: boolean, type?: string, message?: string}>}
 */
const disableOrgUserService = async (updaterAdmin, orgUserId, oldOrgUser, device, requestId, disablitionReason, reasonDescription = undefined) => {
  try {
    logWithTime(`🔄 Disabling organization user: ${orgUserId}...`);

    // Clone old data for audit
    const oldOrgUserClone = cloneForAudit(oldOrgUser);

    // Check if already disabled
    if (!oldOrgUser.isActive) {
      logWithTime(`ℹ️  Organization user already disabled: ${orgUserId}`);
      return {
        success: false,
        type: OrganizationUserErrorTypes.INVALID_DATA,
        message: "Organization user is already disabled"
      };
    }

    // Disable organization user
    const disabledOrgUser = await OrganizationUserModel.findByIdAndUpdate(
      orgUserId,
      {
        isActive: false,
        updatedBy: updaterAdmin.adminId
      },
      { returnDocument: 'after' }
    );

    if (!disabledOrgUser) {
      return {
        success: false,
        type: OrganizationUserErrorTypes.NOT_FOUND,
        message: "Organization user not found"
      };
    }


    logWithTime(`✅ Organization user disabled: ${orgUserId}`);

    // Prepare audit data (old vs disabled state)
    const { oldData, newData } = prepareAuditData(oldOrgUserClone, disabledOrgUser);

    // Log activity
    logActivityTrackerEvent(
      updaterAdmin,
      device,
      requestId,
      ACTIVITY_TRACKER_EVENTS.DISABLE_ORGANIZATION_USER,
      `Disabled organization user ${orgUserId}`,
      {
        oldData,
        newData,
        adminActions: {
          targetId: orgUserId,
          performedOn: DB_COLLECTIONS.ORGANIZATION_USERS,
          reason: disablitionReason,
          reasonDescription: reasonDescription || undefined
        }
      }
    );

    return {
      success: true,
      data: disabledOrgUser
    };

  } catch (error) {
    logWithTime(`❌ Disable organization user service error: ${error.message}`);

    return {
      success: false,
      type: OrganizationUserErrorTypes.INVALID_DATA,
      message: error.message
    };
  }
};

module.exports = { disableOrgUserService };
