const { roleAuthorize } = require("../factory/role-authorize.middleware-factory");
const { ORGANIZATION_ROUTE_AUTHORIZATION } = require("@configs/api-role-permission.config.js");

const organizationRoleAuthorizeMiddlewares = {
    createOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.CREATE_ORGANIZATION),
    updateOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.UPDATE_ORGANIZATION),
    deleteOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.DELETE_ORGANIZATION),
    disableOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.DISABLE_ORGANIZATION),
    enableOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.ENABLE_ORGANIZATION),
    getOrganizationRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.GET_ORGANIZATION),
    listOrganizationsRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.LIST_ORGANIZATIONS),
    createOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.CREATE_ORGANIZATION_USER),
    updateOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.UPDATE_ORGANIZATION_USER),
    deleteOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.DELETE_ORGANIZATION_USER),
    disableOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.DISABLE_ORGANIZATION_USER),
    enableOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.ENABLE_ORGANIZATION_USER),
    getOrgUserRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.GET_ORGANIZATION_USER),
    listOrgUsersRoleAuthorizeMiddleware: roleAuthorize(ORGANIZATION_ROUTE_AUTHORIZATION.LIST_ORGANIZATION_USERS)
}

module.exports = {
    organizationRoleAuthorizeMiddlewares
}