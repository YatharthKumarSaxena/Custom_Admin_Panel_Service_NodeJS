const { CREATED, BAD_REQUEST, CONFLICT, NOT_FOUND, INTERNAL_ERROR, UNAUTHORIZED } = require("@/configs/http-status.config");
const { UserTypes, ClientConversionRequestTypes, ClientConversionRequestStatuses } = require("@/configs/enums.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { ACTIVITY_TRACKER_EVENTS } = require("@/configs/tracker.config");
const { fileUrlRegex } = require("@/configs/regex.config");
const { ClientConversionRequestModel } = require("@/models/client-conversion-request.model");
const { OrganizationModel } = require("@/models/organization.model");
const { checkOrgExists } = require("@/services/organizations/check-org-exists.service");
const { prepareAuditData } = require("@/utils/audit-data.util");
const { extractDomain } = require("@/utils/extract-domain.util");
const { logActivityTrackerEvent } = require("@/services/audit/activity-tracker.service");
const { logWithTime } = require("@/utils/time-stamps.util");

const validateRequestShape = (requestType, organizations, newOrganizations) => {
    const existingCount = organizations.length;
    const newCount = newOrganizations.length;
    const totalClaims = existingCount + newCount;

    if (requestType === ClientConversionRequestTypes.SINGLE_ORGANIZATION) {
        const validSingle =
            (existingCount === 1 && newCount === 0) ||
            (existingCount === 0 && newCount === 1);
        if (!validSingle) {
            return "single_organization request must contain exactly one claim from existing or new organization.";
        }
    }

    if (requestType === ClientConversionRequestTypes.MULTIPLE_ORGANIZATIONS) {
        if (totalClaims < 1 || totalClaims > 2) {
            return "multiple_organizations request must contain between 1 and 2 claims.";
        }
    }

    if (totalClaims > 2) {
        return "Maximum 2 organizations can be entered in one request.";
    }

    return null;
};

const normalizeExistingOrganizations = (organizations = []) => {
    return organizations.map((item) => ({
        organizationId: item.organizationId,
        workEmail: item.workEmail?.trim().toLowerCase(),
        designation: item.designation?.trim() || null,
        proofDocument: item.proofDocument?.trim() || null,
        message: item.message?.trim() || null
    }));
};

const normalizeNewOrganizations = (newOrganizations = []) => {
    return newOrganizations.map((item) => ({
        organizationName: item.organizationName?.trim(),
        website: item.website?.trim(),
        workEmail: item.workEmail?.trim().toLowerCase(),
        designation: item.designation?.trim() || null,
        proofDocument: item.proofDocument?.trim() || null,
        message: item.message?.trim() || null
    }));
};

const validateClaimFields = (organizations, newOrganizations) => {
    for (const item of organizations) {
        if (!item.organizationId || !item.workEmail) {
            return "Each existing organization claim must include organizationId and workEmail.";
        }
        if (item.proofDocument && !fileUrlRegex.test(item.proofDocument)) {
            return "proofDocument must be a valid upload file URL.";
        }
    }

    for (const item of newOrganizations) {
        if (!item.organizationName || !item.website || !item.workEmail) {
            return "Each new organization claim must include organizationName, website and workEmail.";
        }
        if (item.proofDocument && !fileUrlRegex.test(item.proofDocument)) {
            return "proofDocument must be a valid upload file URL.";
        }
    }

    return null;
};

const validateDomainMatch = (organizationWebsite, workEmail) => {
    const orgDomain = extractDomain(organizationWebsite);
    const emailDomain = extractDomain(workEmail);

    if (!orgDomain || !emailDomain || orgDomain !== emailDomain) {
        throw new Error("Work email must match organization domain");
    }
};

const createClientConversionRequestService = async (admin, payload, device, requestId) => {
    try {
        const {
            user,
            requestType,
            conversionReason,
            reasonDescription = null,
            organizations = [],
            newOrganizations = []
        } = payload;

        if (!user) {
            return {
                success: false,
                errorCode: NOT_FOUND,
                message: "User not found"
            };
        }

        if (user.userType === UserTypes.CLIENT) {
            return {
                success: false,
                errorCode: UNAUTHORIZED,
                message: "User is already a client and cannot raise conversion request."
            };
        }

        const normalizedOrganizations = normalizeExistingOrganizations(organizations);
        const normalizedNewOrganizations = normalizeNewOrganizations(newOrganizations);

        const shapeError = validateRequestShape(requestType, normalizedOrganizations, normalizedNewOrganizations);
        if (shapeError) {
            return {
                success: false,
                errorCode: BAD_REQUEST,
                message: shapeError
            };
        }

        const fieldError = validateClaimFields(normalizedOrganizations, normalizedNewOrganizations);
        if (fieldError) {
            return {
                success: false,
                errorCode: BAD_REQUEST,
                message: fieldError
            };
        }

        const activeRequest = await ClientConversionRequestModel.findOne({
            userId: user._id,
            status: ClientConversionRequestStatuses.PENDING
        }).lean();

        if (activeRequest) {
            return {
                success: false,
                errorCode: CONFLICT,
                message: "An active client conversion request already exists for this user."
            };
        }

        const existingOrgIds = normalizedOrganizations.map((item) => item.organizationId);
        if (existingOrgIds.length > 0) {
            const allExist = await checkOrgExists(existingOrgIds);
            if (!allExist) {
                return {
                    success: false,
                    errorCode: NOT_FOUND,
                    message: "One or more organization IDs are invalid."
                };
            }

            const organizationsFromDb = await OrganizationModel.find({ _id: { $in: existingOrgIds } })
                .select("_id website")
                .lean();

            const websiteMap = new Map(
                organizationsFromDb.map((org) => [String(org._id), org.website])
            );

            for (const item of normalizedOrganizations) {
                const website = websiteMap.get(String(item.organizationId));
                if (!website) {
                    return {
                        success: false,
                        errorCode: NOT_FOUND,
                        message: `Organization not found for ID ${item.organizationId}`
                    };
                }
                validateDomainMatch(website, item.workEmail);
            }
        }

        for (const item of normalizedNewOrganizations) {
            validateDomainMatch(item.website, item.workEmail);
        }

        const requestDoc = new ClientConversionRequestModel({
            userId: user._id,
            requestType,
            existingOrganizations: normalizedOrganizations,
            newOrganizations: normalizedNewOrganizations,
            conversionReason,
            reasonDescription,
            createdBy: admin.adminId
        });

        const savedRequest = await requestDoc.save();

        const { oldData, newData } = prepareAuditData(null, savedRequest);

        logActivityTrackerEvent(
            admin,
            device,
            requestId,
            ACTIVITY_TRACKER_EVENTS.CREATE_CLIENT_CONVERSION_REQUEST,
            `Created client conversion request for user ${user.userId}`,
            {
                oldData,
                newData,
                adminActions: {
                    targetId: savedRequest._id.toString(),
                    performedOn: DB_COLLECTIONS.CLIENT_CONVERSION_REQUESTS,
                    reason: conversionReason,
                    reasonDescription: reasonDescription || undefined
                }
            }
        );

        return {
            success: true,
            errorCode: CREATED,
            message: "Client conversion request created successfully.",
            data: savedRequest
        };
    } catch (error) {
        logWithTime(`❌ createClientConversionRequestService error: ${error.message}`);

        if (error?.message === "Work email must match organization domain") {
            return {
                success: false,
                errorCode: BAD_REQUEST,
                message: error.message
            };
        }

        if (error?.code === 11000) {
            return {
                success: false,
                errorCode: CONFLICT,
                message: "An active client conversion request already exists for this user."
            };
        }

        return {
            success: false,
            errorCode: INTERNAL_ERROR,
            message: error.message
        };
    }
};

module.exports = {
    createClientConversionRequestService
};
