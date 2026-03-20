const { OrganizationUserModel } = require("@/models/organizational-user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { OrganizationUserErrorTypes } = require("@/configs/service-error.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { prepareAuditData, cloneForAudit } = require("@utils/audit-data.util");
const { updateOrganizationsInClient } = require("@/internals/internal-client/software-management.client");
const { UserModel } = require("@/models");
const { TotalTypes } = require("@/configs/enums.config");

/**
 * Delete Organization User Service (Soft Delete)
 * @param {Object} deleterAdmin - The admin deleting the org user
 * @param {string} orgUserId - Organization User ID
 * @param {Object} oldOrgUser - Old org user data
 * @param {Object} device - Device object
 * @param {string} requestId - Request ID for tracking
 * @param {string} deletionReason - Reason for deletion
 * @param {string} reasonDescription - Optional description of the reason
 * @returns {Promise<{success: boolean, type?: string, message?: string}>}
 */
const deleteOrgUserService = async (deleterAdmin, orgUserId, oldOrgUser, device, requestId, deletionReason, reasonDescription = undefined) => {
  try {
    logWithTime(`🔄 Deleting organization user: ${orgUserId}...`);

    // Clone old data for audit
    const oldOrgUserClone = cloneForAudit(oldOrgUser);

    // Soft delete
    const deletedOrgUser = await OrganizationUserModel.findByIdAndUpdate(
      orgUserId,
      {
        deletedAt: new Date(),
        deletedBy: deleterAdmin.adminId,
        isActive: false
      },
      { returnDocument: 'after' }
    );

    if (!deletedOrgUser) {
      return {
        success: false,
        type: OrganizationUserErrorTypes.NOT_FOUND,
        message: "Organization user not found"
      };
    }

    logWithTime(`✅ Organization user deleted: ${orgUserId}`);

    const user = await UserModel.findById(deletedOrgUser.userId);

    if (user.userType === TotalTypes.CLIENT) {
      updateOrganizationsInClient(user.userId, deleterAdmin.adminId, deletedOrgUser.organizationId.toString(), null, requestId);
    }

    // Prepare audit data (old vs deleted state)
    const { oldData, newData } = prepareAuditData(oldOrgUserClone, deletedOrgUser);

    // Log activity
    logActivityTrackerEvent(
      deleterAdmin,
      device,
      requestId,
      ACTIVITY_TRACKER_EVENTS.DELETE_ORGANIZATION_USER,
      `Deleted organization user ${orgUserId}`,
      {
        oldData,
        newData,
        adminActions: {
          targetId: orgUserId,
          performedOn: DB_COLLECTIONS.ORGANIZATION_USERS,
          reason: deletionReason,
          reasonDescription: reasonDescription || undefined
        }
      }
    );

    return {
      success: true
    };

  } catch (error) {
    logWithTime(`❌ Delete organization user service error: ${error.message}`);

    return {
      success: false,
      type: OrganizationUserErrorTypes.INVALID_DATA,
      message: error.message
    };
  }
};

module.exports = { deleteOrgUserService };
