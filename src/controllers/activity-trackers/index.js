const { getAdminActivities } = require("./get-admin-activities.controller");
const { listActivities } = require("./list-activities.controller");
const { getMyActivities } = require("./get-my-activities.controller");

const activityTrackerControllers = {
    getAdminActivities,
    listActivities,
    getMyActivities
}

module.exports = {
    activityTrackerControllers
}
