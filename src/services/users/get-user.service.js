// GET ENTITY SERVICE (User or Client)

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes, UserTypes } = require("@configs/enums.config");

/**
 * Get User by ID Service (User or Client)
 * @param {string} userId - The user ID to fetch
 * @returns {Promise<{success: boolean, data?: Object, type?: string, message?: string}>}
 */
const getUserService = async (userId) => {
    try {
        // Validate userId
        if (!userId) {
            logWithTime(`❌ userId is required`);
            return {
                success: false,
                type: AdminErrorTypes.INVALID_DATA,
                message: "userId is required"
            };
        }

        // Fetch entity by ID (User or Client)
        const entity = await UserModel.findOne({
            userId: userId,
            userType: { $in: [UserTypes.USER, UserTypes.CLIENT] },
            isDeleted: false
        }).lean();

        if (!entity) {
            logWithTime(`❌ Entity not found: ${userId}`);
            return {
                success: false,
                type: AdminErrorTypes.NOT_FOUND,
                message: `Entity with ID ${userId} not found`
            };
        }

        logWithTime(`✅ Entity fetched successfully: ${userId}`);

        return {
            success: true,
            data: entity
        };

    } catch (err) {
        logWithTime(`❌ Error in getUserService: ${err.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: err.message
        };
    }
};

module.exports = {
    getUserService
};
