const express = require("express");
const adminRouter = express.Router();

const { adminMiddlewares } = require("@/middlewares/admins");
const { baseAuthAdminMiddlewares } = require("./middleware.gateway.routes");
const { ADMIN_ROUTES } = require("@/configs/uri.config");
const { adminControllers } = require("@/controllers/admins");
const { createAdminRateLimiter, createClientRateLimiter, convertUserToClientRateLimiter } = require("@/rate-limiters/general-api.rate-limiter");
const { commonMiddlewares } = require("@/middlewares/common");
const { ensureUserExists } = require("@/middlewares/users/fetch-user.middleware");
const { CREATE_ADMIN, CREATE_USER, CONVERT_USER_TO_CLIENT } = ADMIN_ROUTES;

adminRouter.post(`${CREATE_ADMIN}`,
  [
    ...baseAuthAdminMiddlewares, 
    createAdminRateLimiter,
    commonMiddlewares.sanitizeAuthBody,
    commonMiddlewares.authValidatorBody,
    commonMiddlewares.firstNameValidator,
    adminMiddlewares.createAdminFieldPresenceMiddleware,
    adminMiddlewares.createAdminValidationMiddleware
  ] , 
  adminControllers.createAdmin);

adminRouter.post(`${CREATE_USER}`,
  [
    ...baseAuthAdminMiddlewares, 
    createClientRateLimiter,
    commonMiddlewares.sanitizeAuthBody,
    commonMiddlewares.authValidatorBody,
    commonMiddlewares.firstNameValidator,
    adminMiddlewares.createUserFieldPresenceMiddleware,
    adminMiddlewares.createUserValidationMiddleware
  ] , 
  adminControllers.createClient);

adminRouter.post(`${CONVERT_USER_TO_CLIENT}`,
  [
    ...baseAuthAdminMiddlewares,
    convertUserToClientRateLimiter,
    adminMiddlewares.convertUserToClientFieldPresenceMiddleware,
    adminMiddlewares.convertUserToClientValidationMiddleware,
    ensureUserExists,
    commonMiddlewares.convertUserToClientMiddleware
  ],
  adminControllers.convertUserToClient);

module.exports = {
    adminRouter
}