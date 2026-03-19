// ADMIN SUCCESS RESPONSES

const { OK, CREATED } = require("@/configs/http-status.config");


const createOrganizationSuccessResponse = (res, org) => {
    return res.status(CREATED).json({
        success: true,
        message: "Organization successfully created.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            contactEmail: org.contactEmail,
            isActive: org.isActive,
            createdBy: org.createdBy,
            createdAt: org.createdAt
        }
    });
};

// Fetch karne ke liye success response
const getOrganizationSuccessResponse = (res, org) => {
    return res.status(OK).json({
        success: true,
        message: "Organization fetched successfully.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            website: org.website,
            logoUrl: org.logoUrl,
            contactEmail: org.contactEmail,
            contactCountryCode: org.contactCountryCode,
            contactLocalNumber: org.contactLocalNumber,
            address: org.address,
            isActive: org.isActive,
            createdAt: org.createdAt
        }
    });
};

const updateOrganizationSuccessResponse = (res, org) => {
    return res.status(OK).json({
        success: true,
        message: "Organization successfully updated.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            website: org.website,
            logoUrl: org.logoUrl,
            contactEmail: org.contactEmail,
            contactCountryCode: org.contactCountryCode,
            contactLocalNumber: org.contactLocalNumber,
            address: org.address,
            isActive: org.isActive,
            updatedAt: org.updatedAt
        }
    });
};

const updateOrganizationNoChangesResponse = (res, org) => {
    return res.status(OK).json({
        success: true,
        message: "No changes detected. Organization remains unchanged.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            website: org.website,
            logoUrl: org.logoUrl,
            contactEmail: org.contactEmail,
            contactCountryCode: org.contactCountryCode,
            contactLocalNumber: org.contactLocalNumber,
            address: org.address,
            isActive: org.isActive,
            updatedAt: org.updatedAt
        }
    });
};

const deleteOrganizationSuccessResponse = (res) => {
    return res.status(OK).json({
        success: true,
        message: "Organization successfully deleted."
    });
};

const listOrganizationsSuccessResponse = (res, result) => {
    const { organizations, total, limit, pages, currentPage } = result;
    return res.status(OK).json({
        success: true,
        message: "Organizations fetched successfully.",
        count: organizations.length,
        pagination: {
            total,
            limit,
            pages,
            currentPage
        },
        data: organizations.map(org => ({
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            website: org.website,
            contactEmail: org.contactEmail,
            isActive: org.isActive,
            createdAt: org.createdAt
        }))
    });
};

const disableOrganizationSuccessResponse = (res, org) => {
    return res.status(OK).json({
        success: true,
        message: "Organization successfully disabled.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            isActive: org.isActive,
            updatedAt: org.updatedAt
        }
    });
};

const enableOrganizationSuccessResponse = (res, org) => {
    return res.status(OK).json({
        success: true,
        message: "Organization successfully enabled.",
        data: {
            id: org._id,
            organizationName: org.organizationName,
            orgType: org.orgType,
            isActive: org.isActive,
            updatedAt: org.updatedAt
        }
    });
};

module.exports = {
    createOrganizationSuccessResponse,
    getOrganizationSuccessResponse,
    updateOrganizationSuccessResponse,
    updateOrganizationNoChangesResponse,
    deleteOrganizationSuccessResponse,
    listOrganizationsSuccessResponse,
    disableOrganizationSuccessResponse,
    enableOrganizationSuccessResponse
};