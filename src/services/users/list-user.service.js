// LIST ENTITIES SERVICE (Users & Clients)

const { UserModel } = require("@models/user.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes, UserTypes } = require("@configs/enums.config");

/**
 * List Users Service (Users and Clients combined)
 * @param {Object} queryParams - Query parameters {page, limit, userType, isActive, isBlocked, firstName, sortBy, sortOrder}
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
const listUsersService = async (queryParams = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            userType,
            isActive,
            isBlocked,
            firstName,
            sortBy = "createdAt",
            sortOrder = -1
        } = queryParams;

        // Build filter object
        const filter = { isDeleted: false };

        // Filter by userType (USER, CLIENT, or both if not specified)
        if (userType) {
            if (userType === "ALL") {
                // Include both USER and CLIENT
                filter.userType = { $in: [UserTypes.USER, UserTypes.CLIENT] };
            } else {
                filter.userType = userType;
            }
        } else {
            // Default: include both USER and CLIENT
            filter.userType = { $in: [UserTypes.USER, UserTypes.CLIENT] };
        }

        // Filter by active status
        if (isActive !== undefined) {
            filter.isActive = isActive === true || isActive === "true";
        }

        // Filter by blocked status
        if (isBlocked !== undefined) {
            filter.isBlocked = isBlocked === true || isBlocked === "true";
        }

        // Filter by firstName
        if (firstName) {
            filter.firstName = { $regex: firstName, $options: "i" };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        // Fetch entities with pagination
        const entities = await UserModel.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        // Get total count
        const totalCount = await UserModel.countDocuments(filter);

        logWithTime(`✅ Listed ${entities.length} entities (Total: ${totalCount})`);

        return {
            success: true,
            data: {
                entities,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            }
        };

    } catch (err) {
        logWithTime(`❌ Error in listEntityService: ${err.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: err.message
        };
    }
};

module.exports = {
    listUsersService
};
