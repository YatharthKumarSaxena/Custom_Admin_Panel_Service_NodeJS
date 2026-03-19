const { validateBody, validateParams, validateQuery } = require("../factory/field-validation.middleware-factory");
const { validationSets } = require("@configs/validation-sets.config.js");

const validationMiddlewares = {
    validateCreateOrganization: validateBody("createOrganization", validationSets.createOrganization),
    validateUpdateOrganization: validateBody("updateOrganization", validationSets.updateOrganization),
    validateDeleteOrganization: validateBody("deleteOrganization", validationSets.deleteOrganization),
    validateDisableOrganization: validateBody("disableOrganization", validationSets.disableOrganization),
    validateEnableOrganization: validateBody("enableOrganization", validationSets.enableOrganization),
    validateCreateOrgUser: validateBody("createOrgUser", validationSets.createOrganizationalUser),
    validateUpdateOrgUser: validateBody("updateOrgUser", validationSets.updateOrganizationalUser),
    validateDeleteOrgUser: validateBody("deleteOrgUser", validationSets.deleteOrganizationalUser),
    validateDisableOrgUser: validateBody("disableOrgUser", validationSets.disableOrganizationalUser),
    validateEnableOrgUser: validateBody("enableOrgUser", validationSets.enableOrganizationalUser)
}

module.exports = {
    validationMiddlewares
};
