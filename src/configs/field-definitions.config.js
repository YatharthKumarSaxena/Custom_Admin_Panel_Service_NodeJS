/**
 * CENTRALIZED FIELD DEFINITIONS CONFIG
 * 
 * Single Source of Truth for:
 * - Required fields per endpoint/action
 * - Validation rules mapping
 * - Field-level metadata
 * 
 * Benefits:
 * 1. Ek jagah change karein, sab jagah reflect ho
 * 2. Type-safe through enum-like structure
 * 3. Automatic derivation of required-fields arrays
 * 4. Direct mapping to validation rules
 */

const { validationRules } = require("./validation.config");

/**
 * Field Metadata Structure:
 * {
 *   field: 'fieldName',           // Field identifier
 *   required: true/false,         // Is this field required?
 *   validation: validationRule,   // Link to validation.config.js rule
 *   description: 'Field purpose'  // Optional documentation
 * }
 */

// AUTH ENDPOINTS FIELD DEFINITIONS

const FieldDefinitions = {
    CREATE_ADMIN: {
        ADMIN_TYPE: {
            field: "adminType",
            required: true,
            validation: validationRules.adminType,
            description: "Type of admin (SUPER_ADMIN, SUB_ADMIN)"
        },
        CREATION_REASON: {
            field: "creationReason",
            required: true,
            validation: validationRules.adminCreationReason,
            description: "Reason for creating this admin account (optional but recommended)"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for admin account creation"
        },
        PASSWORD: {
            field: "password",
            required: true,
            validation: validationRules.password,
            description: "Password for the new admin account"
        },
        ROLE: {
            field: "role",
            required: true,
            validation: validationRules.adminRole,
            description: "Role of the new admin account"
        }
    },
    CREATE_CLIENT: {
        CREATION_REASON: {
            field: "creationReason",
            required: true,
            validation: validationRules.clientCreationReason,
            description: "Reason for creating this client/user account"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for client account creation"
        },
        PASSWORD: {
            field: "password",
            required: true,
            validation: validationRules.password,
            description: "Password for the new client account"
        },
        ROLE: {
            field: "role",
            required: true,
            validation: validationRules.clientRole,
            description: "Role of the new client account (for software management)"
        }
    },
    CONVERT_USER_TO_CLIENT: {
        USER_ID: {
            field: "userId",
            required: true,
            validation: validationRules.userId,
            description: "ID of the user to be converted to client"
        },
        CONVERT_REASON: {
            field: "convertReason",
            required: true,
            validation: validationRules.convertReason,
            description: "Reason for converting user to client"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for user to client conversion"
        },
        ROLE: {
            field: "role",
            required: true,
            validation: validationRules.clientRole,
            description: "Role for the client in software management service"
        }
    },
    CREATE_ORGANIZATION: {
        ORG_NAME: {
            field: "organizationName",
            required: true,
            validation: validationRules.orgName,
            description: "Name of the organization"
        },
        ORG_TYPE: {
            field: "orgType",
            required: true,
            validation: validationRules.orgType,
            description: "Type of the organization (e.g., CORPORATE, EDUCATIONAL, GOVERNMENT)"
        },
        DESCRIPTION: {
            field: "description",
            required: false,
            validation: validationRules.description,
            description: "Brief description about the organization"
        },
        WEBSITE_URL: {
            field: "websiteUrl",
            required: false,
            validation: validationRules.url,
            description: "Official website URL of the organization"
        },
        LOG_URL: {
            field: "logUrl",
            required: false,
            validation: validationRules.url,
            description: "URL where the organization's activity logs can be accessed"
        },
        CONTACT_EMAIL: {
            field: "contactEmail",
            required: false,
            validation: validationRules.email,
            description: "Primary contact email for the organization"
        },
        CONTACT_LOCAL_NUMBER: {
            field: "contactLocalNumber",
            required: false,
            validation: validationRules.localNumber,
            description: "Local contact number (without country code) for the organization"
        },
        CONTACT_COUNTRY_CODE: {
            field: "contactCountryCode",
            required: false,
            validation: validationRules.countryCode,
            description: "Country code for the organization's contact number"
        },
        CREATION_REASON: {
            field: "creationReason",
            required: true,
            validation: validationRules.orgCreationReason,
            description: "Reason for creating this organization (optional but recommended)"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for organization creation"
        }
    },
    UPDATE_ORGANIZATION: {
        ORG_NAME: {
            field: "organizationName",
            required: false,
            validation: validationRules.orgName,
            description: "Updated name of the organization"
        },
        ORG_TYPE: {
            field: "orgType",
            required: false,
            validation: validationRules.orgType,
            description: "Updated type of the organization"
        },
        DESCRIPTION: {
            field: "description",
            required: false,
            validation: validationRules.description,
            description: "Updated description about the organization"
        },
        WEBSITE_URL: {
            field: "websiteUrl",
            required: false,
            validation: validationRules.url,
            description: "Updated official website URL of the organization"
        },
        LOG_URL: {
            field: "logUrl",
            required: false,
            validation: validationRules.url,
            description: "URL where the organization's activity logs can be accessed"
        },
        CONTACT_EMAIL: {
            field: "contactEmail",
            required: false,
            validation: validationRules.email,
            description: "Primary contact email for the organization"
        },
        CONTACT_LOCAL_NUMBER: {
            field: "contactLocalNumber",
            required: false,
            validation: validationRules.localNumber,
            description: "Local contact number (without country code) for the organization"
        },
        CONTACT_COUNTRY_CODE: {
            field: "contactCountryCode",
            required: false,
            validation: validationRules.countryCode,
            description: "Country code for the organization's contact number"
        },
        UPDATION_REASON: {
            field: "updationReason",
            required: true,
            validation: validationRules.orgUpdateReason,
            description: "Reason for updating this organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for organization updation"   
        }
    },
    DELETE_ORGANIZATION: {
        DELETION_REASON: {
            field: "deletionReason",
            required: true,
            validation: validationRules.orgDeletionReason,
            description: "Reason for deleting this organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for organization deletion"
        }
    },
    DISABLE_ORGANIZATION: {
        DISABLITION_REASON: {
            field: "disablitionReason",
            required: true,
            validation: validationRules.orgDisablitionReason,
            description: "Reason for disabling this organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for disabling this organization"
        },
    },
    ENABLE_ORGANIZATION: {
        ENABLE_REASON: {
            field: "enableReason",
            required: true,
            validation: validationRules.orgEnableReason,
            description: "Reason for enabling this organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for enabling this organization"
        },
    },
    CREATE_ORG_USER: {
        USER_ID: {
            field: "userId",
            required: true,
            validation: validationRules.userId,
            description: "ID of the user to be added to the organization"
        },
        ROLE: {
            field: "role",
            required: true,
            validation: validationRules.orgUserRole,
            description: "Role of the user within the organization (e.g., MEMBER, ADMIN)"
        },
        CREATION_REASON: {
            field: "creationReason",
            required: true,
            validation: validationRules.orgUserCreationReason,
            description: "Reason for adding this user to the organization (optional but recommended)"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for adding this user to the organization"
        }
    },
    UPDATE_ORG_USER: {
        ROLE: {
            field: "role",
            required: false,
            validation: validationRules.orgUserRole,
            description: "Updated role of the user within the organization (e.g., MEMBER, ADMIN)"
        },
        UPDATION_REASON: {
            field: "updationReason",
            required: true,
            validation: validationRules.orgUserUpdateReason,
            description: "Reason for updating this user's role in the organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for updating this user's role in the organization"
        }
    },
    DELETE_ORG_USER: {
        DELETION_REASON: {
            field: "deletionReason",
            required: true,
            validation: validationRules.orgUserDeletionReason,
            description: "Reason for removing this user from the organization"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for removing this user from the organization"
        }
    },
    DISABLE_ORG_USER: {
        DISABLITION_REASON: {
            field: "disablitionReason",
            required: true,
            validation: validationRules.orgUserDisablitionReason,
            description: "Reason for disabling this organization user"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for disabling this organization user"
        },
    },
    ENABLE_ORG_USER: {
        ENABLE_REASON: {
            field: "enableReason",
            required: true,
            validation: validationRules.orgUserEnableReason,
            description: "Reason for enabling this organization user"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for enabling this organization user"
        }
    },
    BLOCK_ADMIN: {
        ADMIN_ID: {
            field: "userId",
            required: true,
            validation: validationRules.adminId,
            description: "ID of the admin to be blocked"
        },
        BLOCK_REASON: {
            field: "blockReason",
            required: true,
            validation: validationRules.blockAdminReason,
            description: "Reason for blocking this admin account"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for blocking this admin"
        }
    },
    UNBLOCK_ADMIN: {
        ADMIN_ID: {
            field: "userId",
            required: true,
            validation: validationRules.adminId,
            description: "ID of the admin to be unblocked"
        },
        UNBLOCK_REASON: {
            field: "unblockReason",
            required: true,
            validation: validationRules.unblockAdminReason,
            description: "Reason for unblocking this admin account"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for unblocking this admin"
        }
    },
    BLOCK_USER: {
        USER_ID: {
            field: "userId",
            required: true,
            validation: validationRules.userId,
            description: "ID of the user to be blocked"
        },
        BLOCK_REASON: {
            field: "blockReason",
            required: true,
            validation: validationRules.blockUserReason,
            description: "Reason for blocking this user account"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for blocking this user"
        }
    },
    UNBLOCK_USER: {
        USER_ID: {
            field: "userId",
            required: true,
            validation: validationRules.userId,
            description: "ID of the user to be unblocked"
        },
        UNBLOCK_REASON: {
            field: "unblockReason",
            required: true,
            validation: validationRules.unblockUserReason,
            description: "Reason for unblocking this user account"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for unblocking this user"
        }
    },
    BLOCK_DEVICE: {
        DEVICE_UUID: {
            field: "deviceUUID",
            required: true,
            validation: validationRules.deviceUUID,
            description: "UUID of the device to be blocked"
        },
        BLOCK_REASON: {
            field: "blockReason",
            required: true,
            validation: validationRules.blockDeviceReason,
            description: "Reason for blocking this device"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for blocking this device"
        }
    },
    UNBLOCK_DEVICE: {
        DEVICE_UUID: {
            field: "deviceUUID",
            required: true,
            validation: validationRules.deviceUUID,
            description: "UUID of the device to be unblocked"
        },
        UNBLOCK_REASON: {
            field: "unblockReason",
            required: true,
            validation: validationRules.unblockDeviceReason,
            description: "Reason for unblocking this device"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for unblocking this device"
        }
    },
    GET_ADMIN_ACTIVITIES: {
        ADMIN_ID: {
            field: "userId",
            required: true,
            validation: validationRules.adminId,
            description: "ID of the admin whose activities to retrieve"
        },
        REASON: {
            field: "reason",
            required: true,
            validation: validationRules.adminActivityViewReason,
            description: "Reason for viewing this admin's activities"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about the reason for viewing activities"
        }
    },
    CREATE_CLIENT_CONVERSION_REQUEST: {
        USER_ID: {
            field: "userId",
            required: true,
            validation: validationRules.userId,
            description: "ID of the user requesting client conversion"
        },
        REQUEST_TYPE: {
            field: "requestType",
            required: true,
            validation: validationRules.clientConversionRequestType,
            description: "Request mode: single_organization or multiple_organizations"
        },
        CONVERSION_REASON: {
            field: "conversionReason",
            required: true,
            validation: validationRules.clientConversionRequestReason,
            description: "Reason for raising client conversion request"
        },
        REASON_DESCRIPTION: {
            field: "reasonDescription",
            required: false,
            validation: validationRules.description,
            description: "Additional details about conversion request reason"
        }
    }
    // Future endpoints can be added here following the same structure
};

module.exports = {
  FieldDefinitions
};