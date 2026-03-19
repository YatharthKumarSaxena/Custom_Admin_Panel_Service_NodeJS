const { checkBodyPresence, checkParamsPresence, checkQueryPresence } = require("../factory/validate-request-body.middleware-factory");
const {
    requiredFields
} = require("@configs/required-fields.config.js");

const presenceMiddlewares = {
    createOrganizationFieldPresenceMiddleware: checkBodyPresence("createOrganizationFieldPresence", requiredFields.createOrganizationField),
    updateOrganizationFieldPresenceMiddleware: checkBodyPresence("updateOrganizationFieldPresence", requiredFields.updateOrganizationField),
    deleteOrganizationFieldPresenceMiddleware: checkBodyPresence("deleteOrganizationFieldPresence", requiredFields.deleteOrganizationField),
    disableOrganizationFieldPresenceMiddleware: checkBodyPresence("disableOrganizationFieldPresence", requiredFields.disableOrganizationField),
    enableOrganizationFieldPresenceMiddleware: checkBodyPresence("enableOrganizationFieldPresence", requiredFields.enableOrganizationField),
    createOrgUserFieldPresenceMiddleware: checkBodyPresence("createOrgUserFieldPresence", requiredFields.createOrganizationalUserField),
    updateOrgUserFieldPresenceMiddleware: checkBodyPresence("updateOrgUserFieldPresence", requiredFields.updateOrganizationalUserField),
    deleteOrgUserFieldPresenceMiddleware: checkBodyPresence("deleteOrgUserFieldPresence", requiredFields.deleteOrganizationalUserField),
    disableOrgUserFieldPresenceMiddleware: checkBodyPresence("disableOrgUserFieldPresence", requiredFields.disableOrganizationalUserField),
    enableOrgUserFieldPresenceMiddleware: checkBodyPresence("enableOrgUserFieldPresence", requiredFields.enableOrganizationalUserField)
}

module.exports = {
    presenceMiddlewares
}