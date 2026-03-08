const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes, UserTypes, ClientStatus } = require("@configs/enums.config");
const { createInternalServiceClient } = require("@/utils/internal-service-client.util");
const { getServiceToken } = require("@/internals/service-token");
const { AUTH_SERVICE_URIS } = require("@/configs/internal-uri.config");
const { INTERNAL_API, SERVICE_NAMES } = require("@/internals/constants");
const { errorMessage } = require("@/utils/log-error.util");
const { createClientInSoftwareManagementService } = require("./create-client.service");

/**
 * Convert User to Client Service
 * 
 * NOTE: IDs now use unified USR prefix - ID remains the same, only userType changes
 * 
 * Flow:
 * 1. Call Auth Service to convert user to client (updates userType in Auth DB)
 * 2. Update local Admin Panel DB with new client details
 * 3. Call Software Management Service to create client record
 * 
 * @param {Object} creator - Admin performing the conversion
 * @param {Object} data - {userId, convertReason, role}
 * @param {Object} device - Device info
 * @param {string} requestId - Request tracking ID
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const convertUserToClientService = async (creator, { userId, convertReason, role }, device, requestId) => {
    try {
        logWithTime(`🔄 Starting user to client conversion for ${userId}...`);

        // Step 1: Get service token
        const serviceToken = await getServiceToken(SERVICE_NAMES.ADMIN_PANEL_SERVICE);

        // Step 2: Call Auth Service to convert user to client
        logWithTime(`🔄 Converting user ${userId} to client in Auth Service...`);
        const authClient = createInternalServiceClient(
            INTERNAL_API.CUSTOM_AUTH_SERVICE_URL,
            serviceToken,
            SERVICE_NAMES.ADMIN_PANEL_SERVICE,
            INTERNAL_API.TIMEOUT,
            INTERNAL_API.RETRY_ATTEMPTS,
            INTERNAL_API.RETRY_DELAY
        );

        const userType = UserTypes.CLIENT;

        const authResult = await authClient.callService({
            method: AUTH_SERVICE_URIS.CONVERT_USER_TO_CLIENT.method,
            uri: AUTH_SERVICE_URIS.CONVERT_USER_TO_CLIENT.uri.replace("{userId}", userId),
            body: {
                userId,
                userType
            }
        });

        if (!authResult.success) {
            logWithTime(`❌ Auth Service failed to convert user: ${authResult.error}`);
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: authResult.error || "Failed to convert user in Auth Service"
            };
        }

        logWithTime(`✅ User converted to client in Auth Service: ${userId}`);

        // Step 3: Update Admin Panel DB
        logWithTime(`🔄 Updating user record in Admin Panel DB...`);
        
        const updateResult = await UserModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    userType: UserTypes.CLIENT,
                    clientStatus: ClientStatus.ACTIVE,
                    convertedToClientBy: creator.adminId,
                    convertedToClientAt: new Date(),
                    clientCreationReason: convertReason
                }
            },
            { new: true } // Return updated document
        );

        if (!updateResult) {
            logWithTime(`❌ Failed to update user in Admin Panel DB`);
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: "User not found in Admin Panel database"
            };
        }

        logWithTime(`✅ User updated in Admin Panel DB: ${userId}`);

        // Step 4: Create client in Software Management Service (fire and forget)
        const firstName = updateResult.firstName || null;
        createClientInSoftwareManagementService(userId, firstName, role, serviceToken);

        // Step 5: Log activity
        logActivityTrackerEvent(
            creator,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.CONVERT_USER_TO_CLIENT,
            `Converted user ${userId} to client`,
            {
                oldData: {
                    userId: userId,
                    userType: UserTypes.USER
                },
                newData: {
                    userId: userId,
                    userType: UserTypes.CLIENT,
                    clientStatus: ClientStatus.ACTIVE,
                    convertReason: convertReason,
                    role: role
                },
                adminActions: {
                    targetId: userId,
                    reason: convertReason
                }
            }
        );

        logWithTime(`✅ User to client conversion completed successfully: ${userId}`);

        return {
            success: true,
            data: {
                userId: updateResult.userId,
                userType: updateResult.userType,
                clientStatus: updateResult.clientStatus,
                convertedToClientBy: updateResult.convertedToClientBy,
                convertedToClientAt: updateResult.convertedToClientAt,
                firstName: updateResult.firstName
            }
        };

    } catch (error) {
        logWithTime(`❌ Error in convertUserToClientService: ${error.message}`);
        errorMessage(error);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: error.message
        };
    }
};

module.exports = { convertUserToClientService };