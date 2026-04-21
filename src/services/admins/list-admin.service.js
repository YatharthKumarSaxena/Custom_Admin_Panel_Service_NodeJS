// LIST ADMINS SERVICE

const { AdminModel } = require("@models/admin.model");
const { logWithTime } = require("@utils/time-stamps.util");
const { AdminErrorTypes } = require("@configs/enums.config");

/**
 * List Admins Service with optional filtering
 * @param {Object} queryParams - Query parameters {page, limit, adminType, isActive, isBlocked, isSuspended, firstName, sortBy, sortOrder}
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>}
 */
const listAdminService = async (queryParams = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            adminType,
            isActive,
            isBlocked,
            isSuspended,
            firstName,
            sortBy = "createdAt",
            sortOrder = -1
        } = queryParams;

        // Build filter object
        const filter = { isDeleted: false };

        // Filter by adminType
        if (adminType) {
            filter.adminType = adminType;
        }

        // Filter by active status
        if (isActive !== undefined) {
            filter.isActive = isActive === true || isActive === "true";
        }

        // Filter by blocked status
        if (isBlocked !== undefined) {
            filter.isBlocked = isBlocked === true || isBlocked === "true";
        }

        // Filter by suspended status
        if (isSuspended !== undefined) {
            filter.isSuspended = isSuspended === true || isSuspended === "true";
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

        // Fetch admins with pagination
        const admins = await AdminModel.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        // Get total count
        const totalCount = await AdminModel.countDocuments(filter);

        logWithTime(`✅ Listed ${admins.length} admins (Total: ${totalCount})`);

        return {
            success: true,
            data: {
                admins,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            }
        };

    } catch (err) {
        logWithTime(`❌ Error in listAdminService: ${err.message}`);
        return {
            success: false,
            type: AdminErrorTypes.INVALID_DATA,
            message: err.message
        };
    }
};

module.exports = {
    listAdminService
};
