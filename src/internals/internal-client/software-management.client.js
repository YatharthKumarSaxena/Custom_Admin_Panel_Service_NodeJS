/**
 * Software Management Service Client
 * 
 * Internal API client for communicating with Software Management Service.
 * Handles license management, software registration, and related operations.
 * 
 * @author Admin Panel Service Team
 * @date 2026-03-06
 */

const guard = require('../microservice.guard');
if (!guard) {
    module.exports = null;
    return;
}

const { getServiceToken } = require('../service-token');
const { INTERNAL_API, SERVICE_NAMES } = require('../constants');
const { logWithTime } = require('@/utils/time-stamps.util');
const { createInternalServiceClient } = require('@/utils/internal-service-client.util');
const { SOFTWARE_MANAGEMENT_URIS } = require('@/configs/internal-uri.config');

/**
 * Get authenticated Software Management Service client
 * @returns {Promise<Object>} Client with callService method
 */
const getSoftwareManagementClient = async () => {
    const serviceToken = await getServiceToken(SERVICE_NAMES.ADMIN_PANEL_SERVICE);
    
    return createInternalServiceClient(
        INTERNAL_API.SOFTWARE_MANAGEMENT_BASE_URL,
        serviceToken,
        SERVICE_NAMES.ADMIN_PANEL_SERVICE,
        INTERNAL_API.TIMEOUT,
        INTERNAL_API.RETRY_ATTEMPTS,
        INTERNAL_API.RETRY_DELAY
    );
};

/**
 * Health check for Software Management Service
 * 
 * @returns {Promise<Object>} Health status response
 */
const healthCheck = async () => {
    try {
        logWithTime('🏥 Checking Software Management Service health...');
        
        const client = await getSoftwareManagementClient();
        const result = await client.callService({
            method: SOFTWARE_MANAGEMENT_URIS.HEALTH_CHECK.method,
            uri: SOFTWARE_MANAGEMENT_URIS.HEALTH_CHECK.uri
        });

        if (result.success && result.data?.success === true) {
            logWithTime('✅ Software Management Service is live');
            return {
                success: true,
                data: result.data
            };
        } else {
            logWithTime('⚠️  Software Management Service responded but status is not healthy');
            return {
                success: false,
                error: result.error || 'Service not healthy'
            };
        }
    } catch (error) {
        logWithTime(`❌ Software Management Service health check failed: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Toggle block status for a user (Fire and Forget)
 * Makes async call to Software Management Service without waiting for response
 * 
 * @param {string} userId - The user ID to toggle block status
 * @param {string} adminId - The admin ID initiating the action
 * @param {boolean} isBlocked - The new block status
 * @param {string} requestId - Request ID for tracking
 * @returns {void} - Fire and forget, doesn't return anything
 */
const toggleBlockUserStatus = async (userId, adminId, type, isBlocked, requestId) => {
    try {
        logWithTime(`🔄 Sending toggle block user status to Software Management Service for ${userId}...`);
        
        const client = await getSoftwareManagementClient();
        
        // Fire and forget - don't await the result
        (async () => {
            try {
                const uri = SOFTWARE_MANAGEMENT_URIS.TOGGLE_BLOCK_USER_STATUS.uri.replace(':userId', userId);
                const result = await client.callService({
                    method: SOFTWARE_MANAGEMENT_URIS.TOGGLE_BLOCK_USER_STATUS.method,
                    uri: uri,
                    body: {
                        type: type,
                        adminId: adminId,
                        isBlocked: isBlocked,
                        requestId: requestId
                    }
                });

                if (result.success) {
                    logWithTime(`✅ Software Management Service updated block status for ${userId}`);
                } else {
                    logWithTime(`⚠️  Software Management Service failed to update block status: ${result.error}`);
                }
            } catch (err) {
                logWithTime(`❌ Error in fire-and-forget toggle block user: ${err.message}`);
            }
        })();
        
    } catch (error) {
        logWithTime(`❌ Failed to send toggle block user status to Software Management Service: ${error.message}`);
    }
};

/**
 * Toggle block status for a device (Fire and Forget)
 * Makes async call to Software Management Service without waiting for response
 * 
 * @param {string} userId - The user ID whose device is being toggled
 * @param {string} adminId - The admin ID initiating the action
 * @param {boolean} isBlocked - The new block status
 * @param {string} requestId - Request ID for tracking
 * @returns {void} - Fire and forget, doesn't return anything
 */
const toggleBlockDeviceStatus = async (deviceUUID, adminId, isBlocked, requestId) => {
    try {
        logWithTime(`🔄 Sending toggle block device status to Software Management Service for ${deviceUUID}...`);
        
        const client = await getSoftwareManagementClient();
        
        // Fire and forget - don't await the result
        (async () => {
            try {
                const uri = SOFTWARE_MANAGEMENT_URIS.TOGGLE_BLOCK_DEVICE_STATUS.uri.replace(':deviceUUID', deviceUUID);
                const result = await client.callService({
                    method: SOFTWARE_MANAGEMENT_URIS.TOGGLE_BLOCK_DEVICE_STATUS.method,
                    uri: uri,
                    body: {
                        adminId: adminId,
                        isBlocked: isBlocked,
                        requestId: requestId
                    }
                });

                if (result.success) {
                    logWithTime(`✅ Software Management Service updated device block status for ${deviceUUID}`);
                } else {
                    logWithTime(`⚠️  Software Management Service failed to update device block status: ${result.error}`);
                }
            } catch (err) {
                logWithTime(`❌ Error in fire-and-forget toggle block device: ${err.message}`);
            }
        })();
        
    } catch (error) {
        logWithTime(`❌ Failed to send toggle block device status to Software Management Service: ${error.message}`);
    }
};

module.exports = {
    healthCheck,
    toggleBlockUserStatus,
    toggleBlockDeviceStatus
};