// GET ADMIN ACTIVITIES CONTROLLER

const { getAdminActivitiesService } = require("@services/activity-trackers/get-admin-activities.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwBadRequestError, 
  throwInternalServerError, 
  getLogIdentifiers
} = require("@/responses/common/error-handler.response");
const { activityTrackerSuccessResponses } = require("@responses/success/activity-tracker.response");
const { getAdminActivitiesSuccessResponse } = activityTrackerSuccessResponses; // Placeholder for potential specific success response functions

const getAdminActivities = async (req, res) => {
  try {
    const viewer = req.admin; // Injected by middleware
    const { reason, reasonDescription } = req.body;

    const targetAdmin = req.foundAdmin;
    const adminId = targetAdmin.adminId;

    // Call service to get activities and log the action
    const result = await getAdminActivitiesService(
      viewer,
      adminId,
      req.device,
      req.requestId,
      reason,
      reasonDescription
    );

    // Handle service errors
    if (!result.success) {
      logWithTime(`❌ Service error in getAdminActivities: ${result.message} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, new Error(result.message));
    }

    // Success response
    return getAdminActivitiesSuccessResponse(res, adminId, result.data);

  } catch (err) {
    logWithTime(`❌ Internal Error in getAdminActivities controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getAdminActivities };
