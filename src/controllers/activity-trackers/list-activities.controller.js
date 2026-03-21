// LIST ACTIVITIES CONTROLLER

const { listActivitiesService } = require("@services/activity-trackers/list-activities.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwInternalServerError, 
  getLogIdentifiers
} = require("@/responses/common/error-handler.response");
const { activityTrackerSuccessResponses } = require("@responses/success/activity-tracker.response");
const { listActivitiesSuccessResponse } = activityTrackerSuccessResponses; // Placeholder for potential specific success response functions

const listActivities = async (req, res) => {
  try {
    const viewer = req.admin; // Injected by middleware
    const { limit, page } = req.params;

    // Call service to get activities and log the action
    const result = await listActivitiesService(
      viewer,
      limit,
      page,
      req.device,
      req.requestId
    );

    // Handle service errors
    if (!result.success) {
      logWithTime(`❌ Service error in listActivities: ${result.message} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, new Error(result.message));
    }

    // Success response
    return listActivitiesSuccessResponse(res, result.data, result.pagination);

  } catch (err) {
    logWithTime(`❌ Internal Error in listActivities controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { listActivities };
