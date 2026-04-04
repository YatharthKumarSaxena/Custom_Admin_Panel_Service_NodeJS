const { adminSuccessResponses } = require("./admin.response");
const { userSuccessResponses } = require("./user.response");
const { deviceSuccessResponses } = require("./device.response");
const { activityTrackerSuccessResponses } = require("./activity-tracker.response");
const { createClientConversionRequestSuccessResponse } = require("./client-conversion-request.response");
const {
    createOrgUserSuccessResponse,
    getOrgUserSuccessResponse,
    updateOrgUserSuccessResponse,
    updateOrgUserNoChangesResponse,
    deleteOrgUserSuccessResponse,
    listOrgUsersSuccessResponse
} = require("./organization-user.response");

const successResponses = {
    ...adminSuccessResponses,
    ...userSuccessResponses,
    ...deviceSuccessResponses,
    ...activityTrackerSuccessResponses,
    createClientConversionRequestSuccessResponse,
    createOrgUserSuccessResponse,
    getOrgUserSuccessResponse,
    updateOrgUserSuccessResponse,
    updateOrgUserNoChangesResponse,
    deleteOrgUserSuccessResponse,
    listOrgUsersSuccessResponse
}

module.exports = {
    ...successResponses
}