const { roleAuthorize } = require("../factory/role-authorize.middleware-factory");
const { USER_ROUTE_AUTHORIZATION } = require("@configs/api-role-permission.config.js");

const userRoleAuthorizeMiddlewares = {
    listUsersRoleAuthorizeMiddleware: roleAuthorize(USER_ROUTE_AUTHORIZATION.LIST_USERS),
    getUserRoleAuthorizeMiddleware: roleAuthorize(USER_ROUTE_AUTHORIZATION.GET_USER)
}

module.exports = {
    userRoleAuthorizeMiddlewares
}
