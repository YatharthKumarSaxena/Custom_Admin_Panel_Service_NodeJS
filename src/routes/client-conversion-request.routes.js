const express = require("express");
const clientConversionRequestRouter = express.Router();

const { CLIENT_CONVERSION_REQUEST_ROUTES } = require("@/configs/uri.config");
const { baseAuthAdminMiddlewares } = require("@/routes/middleware.gateway.routes");
const { ensureUserExists } = require("@/middlewares/users/fetch-user.middleware");
const { createClientConversionRequestRateLimiter } = require("@/rate-limiters/general-api.rate-limiter");
const { clientConversionRequestMiddlewares } = require("@/middlewares/client-conversion-requests");
const { clientConversionRequestControllers } = require("@/controllers/client-conversion-requests");

const { CREATE_CLIENT_CONVERSION_REQUEST } = CLIENT_CONVERSION_REQUEST_ROUTES;

clientConversionRequestRouter.post(
    `${CREATE_CLIENT_CONVERSION_REQUEST}`,
    [
        ...baseAuthAdminMiddlewares,
        createClientConversionRequestRateLimiter,
        clientConversionRequestMiddlewares.createClientConversionRequestFieldPresenceMiddleware,
        clientConversionRequestMiddlewares.validateCreateClientConversionRequest,
        ensureUserExists
    ],
    clientConversionRequestControllers.createClientConversionRequestController
);

module.exports = {
    clientConversionRequestRouter
};
