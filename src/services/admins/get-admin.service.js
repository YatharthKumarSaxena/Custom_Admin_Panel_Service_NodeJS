// GET ADMIN SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * Get Admin by ID Service
 * @param {string} adminId - The admin ID to fetch
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getAdminService = async (adminId) => {
    try {
        // Validate adminId
        if (!adminId) {
            logWithTime(`❌ adminId is required`);
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "adminId is required"
            };
        }

        // Fetch admin by ID
        const admin = await AdminModel.findOne({
            adminId,
            isDeleted: false
        }).lean();

        if (!admin) {
            logWithTime(`❌ Admin not found: ${adminId}`);
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: `Admin with ID ${adminId} not found`
            };
        }

        logWithTime(`✅ Admin fetched successfully: ${adminId}`);

        return {
            success: true,
            data: admin
        };

    } catch (err) {
        logWithTime(`❌ Error in getAdminService: ${err.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: err.message
        };
    }
};

module.exports = {
    getAdminService
};
