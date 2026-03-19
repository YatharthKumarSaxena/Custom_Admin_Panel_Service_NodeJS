const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { OrganizationUserModel } = require("@/models/organizational-user.model");
const { OrganizationUserErrorTypes } = require("@/configs/service-error.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");

/**
 * Enable Organization User Service (Set isActive: true)
 * @param {Object} updaterAdmin - The admin enabling the org user
 * @param {string} orgUserId - Organization User ID
 * @param {Object} oldOrgUser - Old org user data
 * @param {Object} device - Device object
 * @param {string} requestId - Request ID for tracking
 * @param {string} enableReason - Reason for enabling
 * @param {string} reasonDescription - Optional description of the reason
 * @returns {Promise<{success: boolean, type?: string, message?: string}>}
 */
const enableOrgUserService = async (updaterAdmin, orgUserId, oldOrgUser, device, requestId, enableReason, reasonDescription = undefined) => {
  try {
    logWithTime(`🔄 Enabling organization user: ${orgUserId}...`);

    // Clone old data for audit
    const oldOrgUserClone = cloneForAudit(oldOrgUser);

    // Check if already enabled
    if (oldOrgUser.isActive) {
      logWithTime(`ℹ️  Organization user already enabled: ${orgUserId}`);
      return {
        success: false,
        type: OrganizationUserErrorTypes.INVALID_DATA,
        message: "Organization user is already enabled"
      };
    }

    // Enable organization user
    const enabledOrgUser = await OrganizationUserModel.findByIdAndUpdate(
      orgUserId,
      {
        isActive: true,
        updatedBy: updaterAdmin.adminId
      },
      { returnDocument: 'after' }
    );

    if (!enabledOrgUser) {
      return {
        success: false,
        type: OrganizationUserErrorTypes.NOT_FOUND,
        message: "Organization user not found"
      };
    }

    logWithTime(`✅ Organization user enabled: ${orgUserId}`);

    // Prepare audit data (old vs enabled state)
    const { oldData, newData } = prepareAuditData(oldOrgUserClone, enabledOrgUser);

    // Log activity
    logActivityTrackerEvent(
      updaterAdmin,
      device,
      requestId,
      ACTIVITY_TRACKER_EVENTS.ENABLE_ORGANIZATION_USER,
      `Enabled organization user ${orgUserId}`,
      {
        oldData,
        newData,
        adminActions: {
          targetId: orgUserId,
          performedOn: DB_COLLECTIONS.ORGANIZATION_USERS,
          reason: enableReason,
          reasonDescription: reasonDescription || undefined
        }
      }
    );

    return {
      success: true,
      data: enabledOrgUser
    };

  } catch (error) {
    logWithTime(`❌ Enable organization user service error: ${error.message}`);

    return {
      success: false,
      type: OrganizationUserErrorTypes.INVALID_DATA,
      message: error.message
    };
  }
};

module.exports = { enableOrgUserService };
