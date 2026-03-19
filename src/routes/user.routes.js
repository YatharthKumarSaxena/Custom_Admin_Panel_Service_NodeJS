const express = require("express");
const userRouter = express.Router();

const { baseAuthAdminMiddlewares } = require("./middleware.gateway.routes");
const { USER_ROUTES } = require("@/configs/uri.config");
const { userControllers } = require("@/controllers/users");
const { blockUserRateLimiter, unblockUserRateLimiter } = require("@/rate-limiters/general-api.rate-limiter");
const { ensureUserExists } = require("@/middlewares/users/fetch-user.middleware");
const { userBlockUnblockPresenceMiddlewares } = require("@/middlewares/users/validate-request-body.middleware");
const { userBlockUnblockValidationMiddlewares } = require("@/middlewares/users/field-validation.middleware");
const { BLOCK_USER, UNBLOCK_USER } = USER_ROUTES;

userRouter.post(`${BLOCK_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    blockUserRateLimiter,
    userBlockUnblockPresenceMiddlewares.blockUserFieldPresenceMiddleware,
    userBlockUnblockValidationMiddlewares.blockUserValidationMiddleware,
    ensureUserExists
  ],
  userControllers.blockUser);

userRouter.post(`${UNBLOCK_USER}`,
  [
    ...baseAuthAdminMiddlewares,
    unblockUserRateLimiter,
    userBlockUnblockPresenceMiddlewares.unblockUserFieldPresenceMiddleware,
    userBlockUnblockValidationMiddlewares.unblockUserValidationMiddleware,
    ensureUserExists
  ],
  userControllers.unblockUser);

module.exports = {
    userRouter
};
