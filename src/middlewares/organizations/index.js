const { checkOrganizationExistsMiddleware } = require("./check-organization-exists.middleware");
const { validationMiddlewares } = require("./field-validation.middleware");
const { presenceMiddlewares } = require("./validate-request-body.middleware");
const { organizationRoleAuthorizeMiddlewares } = require("./role-authorize.middleware");
const { checkOrganizationUserExistsMiddleware } = require("./check-org-user-exists.middleware");

const organizationMiddlewares = {
    ...validationMiddlewares,
    ...presenceMiddlewares,
    ...organizationRoleAuthorizeMiddlewares,
    checkOrganizationUserExistsMiddleware,
    checkOrganizationExistsMiddleware
}

module.exports = {
    organizationMiddlewares
}
