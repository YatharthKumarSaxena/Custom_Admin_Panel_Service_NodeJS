const { DeviceModel } = require("@models/device.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { ACTIVITY_TRACKER_EVENTS } = require("@configs/tracker.config");
const { AdminErrorTypes } = require("@configs/enums.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { errorMessage } = require("@/utils/log-error.util");

const createDeviceService = async (user, userDevice, device, requestId) => {
    try {
        const { deviceUUID, deviceType } = device;
        const existing = await DeviceModel.findOne({ deviceUUID }).lean();

        // Helper function to normalize values for comparison
        const normalize = (val) => {
            if (val === null || val === undefined) return "";
            return String(val).trim().toLowerCase();
        };

        let actualChanges = false;
        const updateFields = {}; // Only add fields that actually need updating

        if (!existing) {
            // New device is being created
            actualChanges = true;
            if (deviceType) updateFields.deviceType = deviceType;
        } else {
            // Device exists - only check if provided values are different
            if (deviceType && normalize(existing.deviceType) !== normalize(deviceType)) {
                updateFields.deviceType = deviceType;
                actualChanges = true;
            }
        }

        // Only update if there are actual changes
        if (!actualChanges) {
            logWithTime(`ℹ️  No changes detected for device ${deviceUUID}. Skipping update.`);
            return {
                success: true,
                oldDevice: existing,
                newDevice: existing,
                noChanges: true
            };
        }

        // Perform the update dynamically with only the modified fields
        const updatedDevice = await DeviceModel.findOneAndUpdate(
            { deviceUUID },
            {
                $set: updateFields,
                $setOnInsert: { deviceUUID }
            },
            { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true } // Replaced { new: true } to prevent Mongoose warning
        );

        const oldData = existing || null;
        const newData = updatedDevice.toObject();

        const eventType = existing
            ? ACTIVITY_TRACKER_EVENTS.UPDATE_DEVICE
            : ACTIVITY_TRACKER_EVENTS.CREATE_DEVICE;

        const message = existing
            ? `Updated device ${deviceUUID}`
            : `Created device ${deviceUUID}`;

        // Log activity only if actual changes were detected
        logActivityTrackerEvent(
            user,
            userDevice,
            requestId,
            eventType,
            message,
            {
                oldData,
                newData,
                adminActions: {
                    targetId: updatedDevice._id,
                    performedOn: DB_COLLECTIONS.DEVICES
                }
            }
        );

        logWithTime(`✅ ${message} successfully: ${deviceUUID}`);
        return {
            success: true,
            oldDevice: existing ? existing : null,
            newDevice: updatedDevice
        };
    } catch (err) {
        errorMessage(err);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: "An error occurred while creating the device"
        };
    }
}

module.exports = { createDeviceService };