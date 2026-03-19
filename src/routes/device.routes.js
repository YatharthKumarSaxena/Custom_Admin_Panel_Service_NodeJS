const express = require("express");
const deviceRouter = express.Router();

const { baseAuthAdminMiddlewares } = require("./middleware.gateway.routes");
const { DEVICE_ROUTES } = require("@/configs/uri.config");
const { deviceControllers } = require("@/controllers/devices");
const { blockDeviceRateLimiter, unblockDeviceRateLimiter } = require("@/rate-limiters/general-api.rate-limiter");
const { deviceBlockUnblockPresenceMiddlewares } = require("@/middlewares/devices/validate-request-body.middleware");
const { deviceBlockUnblockValidationMiddlewares } = require("@/middlewares/devices/field-validation.middleware");
const { BLOCK_DEVICE, UNBLOCK_DEVICE } = DEVICE_ROUTES;

deviceRouter.post(`${BLOCK_DEVICE}`,
  [
    ...baseAuthAdminMiddlewares,
    blockDeviceRateLimiter,
    deviceBlockUnblockPresenceMiddlewares.blockDeviceFieldPresenceMiddleware,
    deviceBlockUnblockValidationMiddlewares.blockDeviceValidationMiddleware
  ],
  deviceControllers.blockDevice);

deviceRouter.post(`${UNBLOCK_DEVICE}`,
  [
    ...baseAuthAdminMiddlewares,
    unblockDeviceRateLimiter,
    deviceBlockUnblockPresenceMiddlewares.unblockDeviceFieldPresenceMiddleware,
    deviceBlockUnblockValidationMiddlewares.unblockDeviceValidationMiddleware
  ],
  deviceControllers.unblockDevice);

module.exports = {
    deviceRouter
};
