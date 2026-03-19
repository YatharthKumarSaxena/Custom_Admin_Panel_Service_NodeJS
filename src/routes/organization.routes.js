const express = require("express");
const organizationRouter = express.Router();

const { baseAuthAdminMiddlewares } = require("./middleware.gateway.routes");
const { ORGANIZATIONAL_ROUTES } = require("@/configs/uri.config");
const { organizationControllers } = require("@controllers/organizations");
const { orgUserControllers } = require("@/controllers/organization-users");
const { 
    createOrgUserRateLimiter, 
    createOrganizationRateLimiter, 
    deleteOrganizationRateLimiter,
    disableOrganizationRateLimiter,
    enableOrganizationRateLimiter,
    deleteOrgUserRateLimiter,
    disableOrgUserRateLimiter,
    enableOrgUserRateLimiter,
    updateOrgUserRateLimiter, 
    updateOrganizationRateLimiter, 
    getOrgUserRateLimiter, 
    getOrganizationRateLimiter, 
    listOrgUsersRateLimiter, 
    listOrganizationsRateLimiter
 } = require("@/rate-limiters/general-api.rate-limiter");
const { ensureUserExists } = require("@/middlewares/users/fetch-user.middleware");
const { organizationMiddlewares } = require("@/middlewares/organizations");
const { 
    CREATE_ORGANIZATION, 
    UPDATE_ORGANIZATION,
    DELETE_ORGANIZATION,
    DISABLE_ORGANIZATION,
    ENABLE_ORGANIZATION,
    CREATE_ORGANIZATION_USER, 
    UPDATE_ORGANIZATION_USER, 
    DELETE_ORGANIZATION_USER,
    DISABLE_ORGANIZATION_USER,
    ENABLE_ORGANIZATION_USER,
    GET_ORGANIZATION,
    GET_ORGANIZATION_USER,
    LIST_ORGANIZATIONS,
    LIST_ORGANIZATION_USERS
} = ORGANIZATIONAL_ROUTES;

organizationRouter.post(`${CREATE_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    createOrganizationRateLimiter,
    organizationMiddlewares.createOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.createOrganizationFieldPresenceMiddleware,
    organizationMiddlewares.validateCreateOrganization,
  ] , 
  organizationControllers.createOrganizationController);

organizationRouter.post(`${CREATE_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    createOrgUserRateLimiter,
    organizationMiddlewares.createOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.createOrgUserFieldPresenceMiddleware,
    organizationMiddlewares.validateCreateOrgUser,
    organizationMiddlewares.checkOrganizationExistsMiddleware,
    ensureUserExists
  ] , 
  orgUserControllers.createOrgUserController);

organizationRouter.patch(`${UPDATE_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    updateOrganizationRateLimiter,
    organizationMiddlewares.updateOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.updateOrganizationFieldPresenceMiddleware,
    organizationMiddlewares.validateUpdateOrganization,
    organizationMiddlewares.checkOrganizationExistsMiddleware
  ] , 
  organizationControllers.updateOrganizationController);

organizationRouter.patch(`${UPDATE_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    updateOrgUserRateLimiter,
    organizationMiddlewares.updateOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.updateOrgUserFieldPresenceMiddleware,
    organizationMiddlewares.validateUpdateOrgUser,
    organizationMiddlewares.checkOrganizationUserExistsMiddleware
  ] , 
  orgUserControllers.updateOrgUserController);

organizationRouter.delete(`${DELETE_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    deleteOrganizationRateLimiter,
    organizationMiddlewares.deleteOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.deleteOrganizationFieldPresenceMiddleware,
    organizationMiddlewares.validateDeleteOrganization,
    organizationMiddlewares.checkOrganizationExistsMiddleware
  ] , 
  organizationControllers.deleteOrganizationController);

organizationRouter.patch(`${DISABLE_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    disableOrganizationRateLimiter,
    organizationMiddlewares.disableOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.disableOrganizationFieldPresenceMiddleware,
    organizationMiddlewares.validateDisableOrganization,
    organizationMiddlewares.checkOrganizationExistsMiddleware
  ] , 
  organizationControllers.disableOrganizationController);

organizationRouter.patch(`${ENABLE_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    enableOrganizationRateLimiter,
    organizationMiddlewares.enableOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.enableOrganizationFieldPresenceMiddleware,
    organizationMiddlewares.validateEnableOrganization,
    organizationMiddlewares.checkOrganizationExistsMiddleware
  ] , 
  organizationControllers.enableOrganizationController);

organizationRouter.delete(`${DELETE_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    deleteOrgUserRateLimiter,
    organizationMiddlewares.deleteOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.deleteOrgUserFieldPresenceMiddleware,
    organizationMiddlewares.validateDeleteOrgUser,
    organizationMiddlewares.checkOrganizationUserExistsMiddleware
  ] , 
  orgUserControllers.deleteOrgUserController);

organizationRouter.patch(`${DISABLE_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    disableOrgUserRateLimiter,
    organizationMiddlewares.disableOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.disableOrgUserFieldPresenceMiddleware,
    organizationMiddlewares.validateDisableOrgUser,
    organizationMiddlewares.checkOrganizationUserExistsMiddleware
  ] , 
  orgUserControllers.disableOrgUserController);

organizationRouter.patch(`${ENABLE_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    enableOrgUserRateLimiter,
    organizationMiddlewares.enableOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.enableOrgUserFieldPresenceMiddleware,
    organizationMiddlewares.validateEnableOrgUser,
    organizationMiddlewares.checkOrganizationUserExistsMiddleware
  ] , 
  orgUserControllers.enableOrgUserController);

organizationRouter.get(`${GET_ORGANIZATION}`,
  [
    ...baseAuthAdminMiddlewares,
    getOrganizationRateLimiter,
    organizationMiddlewares.getOrganizationRoleAuthorizeMiddleware,
    organizationMiddlewares.checkOrganizationExistsMiddleware
  ] , 
  organizationControllers.getOrganizationController);

organizationRouter.get(`${GET_ORGANIZATION_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    getOrgUserRateLimiter,
    organizationMiddlewares.getOrgUserRoleAuthorizeMiddleware,
    organizationMiddlewares.checkOrganizationUserExistsMiddleware
  ] , 
  orgUserControllers.getOrgUserController);

organizationRouter.get(`${LIST_ORGANIZATIONS}`,
  [
    ...baseAuthAdminMiddlewares,
    listOrganizationsRateLimiter,
    organizationMiddlewares.listOrganizationsRoleAuthorizeMiddleware
  ] , 
  organizationControllers.listOrganizationController);

organizationRouter.get(`${LIST_ORGANIZATION_USERS}`,
  [
    ...baseAuthAdminMiddlewares,
    listOrgUsersRateLimiter,
    organizationMiddlewares.listOrgUsersRoleAuthorizeMiddleware
  ] , 
  orgUserControllers.listOrgUsersController);

module.exports = {
    organizationRouter
}