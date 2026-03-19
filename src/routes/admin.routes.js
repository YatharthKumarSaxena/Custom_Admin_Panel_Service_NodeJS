const express = require("express");
const adminRouter = express.Router();

const { adminMiddlewares } = require("@/middlewares/admins");
const { baseAuthAdminMiddlewares } = require("./middleware.gateway.routes");
const { ADMIN_ROUTES } = require("@/configs/uri.config");
const { adminControllers } = require("@/controllers/admins");
const { createAdminRateLimiter, createClientRateLimiter, convertUserToClientRateLimiter, blockAdminRateLimiter, unblockAdminRateLimiter } = require("@/rate-limiters/general-api.rate-limiter");
const { commonMiddlewares } = require("@/middlewares/common");
const { ensureUserExists } = require("@/middlewares/users/fetch-user.middleware");
const { CREATE_ADMIN, CREATE_CLIENT, CONVERT_USER_TO_CLIENT, BLOCK_ADMIN, UNBLOCK_ADMIN } = ADMIN_ROUTES;

adminRouter.post(`${CREATE_ADMIN}`,
  [
    ...baseAuthAdminMiddlewares, 
    createAdminRateLimiter,
    adminMiddlewares.createAdminRoleAuthorizeMiddleware,
    commonMiddlewares.sanitizeAuthBody,
    commonMiddlewares.authValidatorBody,
    commonMiddlewares.firstNameValidator,
    adminMiddlewares.createAdminFieldPresenceMiddleware,
    adminMiddlewares.createAdminValidationMiddleware
  ] , 
  adminControllers.createAdmin);

adminRouter.post(`${CREATE_CLIENT}`,
  [
    ...baseAuthAdminMiddlewares, 
    createClientRateLimiter,
    adminMiddlewares.createClientRoleAuthorizeMiddleware,
    commonMiddlewares.sanitizeAuthBody,
    commonMiddlewares.authValidatorBody,
    commonMiddlewares.firstNameValidator,
    adminMiddlewares.createClientFieldPresenceMiddleware,
    adminMiddlewares.createClientValidationMiddleware
  ] , 
  adminControllers.createClient);

adminRouter.post(`${CONVERT_USER_TO_CLIENT}`,
  [
    ...baseAuthAdminMiddlewares,
    convertUserToClientRateLimiter,
    adminMiddlewares.convertUserToClientRoleAuthorizeMiddleware,
    adminMiddlewares.convertUserToClientFieldPresenceMiddleware,
    adminMiddlewares.convertUserToClientValidationMiddleware,
    ensureUserExists,
    commonMiddlewares.convertUserToClientMiddleware
  ],
  adminControllers.convertUserToClient);

adminRouter.post(`${BLOCK_ADMIN}`,
  [
    ...baseAuthAdminMiddlewares,
    blockAdminRateLimiter,
    adminMiddlewares.adminBlockingFeatureEnabledMiddleware,
    adminMiddlewares.blockAdminRoleAuthorizeMiddleware,
    adminMiddlewares.blockAdminFieldPresenceMiddleware,
    adminMiddlewares.blockAdminValidationMiddleware,
    adminMiddlewares.ensureAdminExists,
    adminMiddlewares.hierarchyGuard
  ],
  adminControllers.blockAdmin);

adminRouter.post(`${UNBLOCK_ADMIN}`,
  [
    ...baseAuthAdminMiddlewares,
    unblockAdminRateLimiter,
    adminMiddlewares.adminBlockingFeatureEnabledMiddleware,
    adminMiddlewares.unblockAdminRoleAuthorizeMiddleware,
    adminMiddlewares.unblockAdminFieldPresenceMiddleware,
    adminMiddlewares.unblockAdminValidationMiddleware,
    adminMiddlewares.ensureAdminExists,
    adminMiddlewares.hierarchyGuard
  ],
  adminControllers.unblockAdmin);

module.exports = {
    adminRouter
}