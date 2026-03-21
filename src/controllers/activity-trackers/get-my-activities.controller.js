// GET MY ACTIVITIES CONTROLLER

const { getMyActivitiesService } = require("@services/activity-trackers/get-my-activities.service");
const { logWithTime } = require("@utils/time-stamps.util");
const { 
  throwInternalServerError, 
  getLogIdentifiers
} = require("@/responses/common/error-handler.response");
const { activityTrackerSuccessResponses } = require("@responses/success/activity-tracker.response");
const { getMyActivitiesSuccessResponse } = activityTrackerSuccessResponses; // Placeholder for potential specific success response functions

const getMyActivities = async (req, res) => {
  try {
    const admin = req.admin; // Injected by middleware
    const { limit, page } = req.params;

    // Call service to get own activities
    const result = await getMyActivitiesService(
      admin,
      limit,
      page
    );

    // Handle service errors
    if (!result.success) {
      logWithTime(`❌ Service error in getMyActivities: ${result.message} ${getLogIdentifiers(req)}`);
      return throwInternalServerError(res, new Error(result.message));
    }

    // Success response
    return getMyActivitiesSuccessResponse(res, result.data, result.pagination);

  } catch (err) {
    logWithTime(`❌ Internal Error in getMyActivities controller ${getLogIdentifiers(req)}: ${err.message}`);
    return throwInternalServerError(res, err);
  }
};

module.exports = { getMyActivities };
