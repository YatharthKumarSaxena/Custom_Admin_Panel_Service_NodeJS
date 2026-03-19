// ORGANIZATION USER SUCCESS RESPONSES

const { OK, CREATED } = require("@/configs/http-status.config");
const success = require(".");

const createOrgUserSuccessResponse = (res, orgUser) => {
    return res.status(CREATED).json({
        success: true,
        message: "Organization user successfully created.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            role: orgUser.role,
            isActive: orgUser.isActive,
            createdAt: orgUser.createdAt
        }
    });
};

const getOrgUserSuccessResponse = (res, orgUser) => {
    return res.status(OK).json({
        success: true,
        message: "Organization user fetched successfully.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            role: orgUser.role,
            isActive: orgUser.isActive,
            createdAt: orgUser.createdAt
        }
    });
};

const updateOrgUserSuccessResponse = (res, orgUser) => {
    return res.status(OK).json({
        success: true,
        message: "Organization user successfully updated.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            role: orgUser.role,
            isActive: orgUser.isActive,
            updatedAt: orgUser.updatedAt
        }
    });
};

const updateOrgUserNoChangesResponse = (res, orgUser) => {
    return res.status(OK).json({
        success: true,
        message: "No changes detected. Organization user remains unchanged.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            role: orgUser.role,
            isActive: orgUser.isActive,
            updatedAt: orgUser.updatedAt
        }
    });
};

const deleteOrgUserSuccessResponse = (res) => {
    return res.status(OK).json({
        success: true,
        message: "Organization user successfully deleted."
    });
};

const listOrgUsersSuccessResponse = (res, result) => {
    const { orgUsers, total, limit, pages, currentPage } = result;
    return res.status(OK).json({
        success: true,
        message: "Organization users fetched successfully.",
        count: orgUsers.length,
        pagination: {
            total,
            limit,
            pages,
            currentPage
        },
        data: orgUsers.map(orgUser => ({
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            role: orgUser.role,
            isActive: orgUser.isActive,
            createdAt: orgUser.createdAt
        }))
    })
};

const disableOrgUserSuccessResponse = (res, orgUser) => {
    return res.status(OK).json({
        success: true,
        message: "Organization user disabled successfully.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            isActive: orgUser.isActive,
            updatedAt: orgUser.updatedAt
        }
    })
}

const enableOrgUserSuccessResponse = (res, orgUser) => {
    return res.status(OK).json({
        success: true,
        message: "Organization user enabled successfully.",
        data: {
            id: orgUser._id,
            userId: orgUser.userId,
            organizationId: orgUser.organizationId,
            isActive: orgUser.isActive,
            updatedAt: orgUser.updatedAt
        }
    })
}

module.exports = {
    createOrgUserSuccessResponse,
    getOrgUserSuccessResponse,
    updateOrgUserSuccessResponse,
    updateOrgUserNoChangesResponse,
    deleteOrgUserSuccessResponse,
    listOrgUsersSuccessResponse,
    disableOrgUserSuccessResponse,
    enableOrgUserSuccessResponse
};
