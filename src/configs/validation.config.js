const {
    strongPasswordRegex,
    phoneNumberRegex,
    emailRegex,
    customIdRegex,
    orgRoleRegex,
    orgNameRegex,
    localNumberRegex,
    countryCodeRegex,
    urlRegex,
    UUID_V4_REGEX
} = require("./regex.config");

const {
    passwordLength,
    phoneNumberLength,
    emailLength,
    customIdLength,
    orgRoleLength,
    orgNameLength,
    localNumberLength,
    countryCodeLength,
    urlLength,
    descriptionLength
} = require("./fields-length.config");

const {
    AdminTypesHelper,
    AdminRoleTypesHelper,
    ClientRoleTypesHelper,
    AdminCreationReasonsHelper,
    ClientCreationReasonsHelper,
    ConvertUserToClientReasonsHelper,
    OrganizationTypesHelper,
    OrganizationCreationReasonsHelper,
    OrganizationUpdateReasonsHelper,
    OrganizationDeletionReasonsHelper,
    OrganizationDisablitionReasonsHelper,
    OrganizationEnableReasonsHelper,
    OrganizationalUserCreationReasonsHelper,
    OrganizationalUserUpdateReasonsHelper,
    OrganizationalUserDeletionReasonsHelper,
    OrganizationalUserDisablitionReasonsHelper,
    OrganizationalUserEnableReasonsHelper,
    BlockAdminReasonsHelper,
    UnblockAdminReasonsHelper,
    BlockUserReasonsHelper,
    UnblockUserReasonsHelper,
    BlockDeviceReasonsHelper,
    UnblockDeviceReasonsHelper,
    ViewActivityTrackerReasonsHelper
} = require("@utils/enum-validators.util");

const validationRules = {
    password: {
        regex: strongPasswordRegex,
        length: passwordLength
    },
    phone: {
        length: phoneNumberLength,
        regex: phoneNumberRegex
    },
    email: {
        length: emailLength,
        regex: emailRegex
    },
    adminType: {
        enum: AdminTypesHelper
    },
    adminRole: {
        enum: AdminRoleTypesHelper
    },
    clientRole: {
        enum: ClientRoleTypesHelper
    },
    adminCreationReason: {
        enum: AdminCreationReasonsHelper
    },
    clientCreationReason: {
        enum: ClientCreationReasonsHelper
    },
    convertReason: {
        enum: ConvertUserToClientReasonsHelper
    },
    userId: {
        length: customIdLength,
        regex: customIdRegex
    },
    adminId: {
        length: customIdLength,
        regex: customIdRegex
    },
    blockAdminReason: {
        enum: BlockAdminReasonsHelper
    },
    unblockAdminReason: {
        enum: UnblockAdminReasonsHelper
    },
    blockUserReason: {
        enum: BlockUserReasonsHelper
    },
    unblockUserReason: {
        enum: UnblockUserReasonsHelper
    },
    blockDeviceReason: {
        enum: BlockDeviceReasonsHelper
    },
    unblockDeviceReason: {
        enum: UnblockDeviceReasonsHelper
    },
    deviceUUID: {
        regex: UUID_V4_REGEX
    },
    orgRole: {
        length: orgRoleLength,
        regex: orgRoleRegex
    },
    orgName: {
        length: orgNameLength,
        regex: orgNameRegex
    },
    orgType: {
        enum: OrganizationTypesHelper
    },
    localNumber: {
        length: localNumberLength,
        regex: localNumberRegex
    },
    countryCode: {
        length: countryCodeLength,
        regex: countryCodeRegex
    },
    url: {
        length: urlLength,
        regex: urlRegex
    },
    orgCreationReason: {
        enum: OrganizationCreationReasonsHelper
    },
    orgUpdateReason: {
        enum: OrganizationUpdateReasonsHelper
    },
    orgDeletionReason: {
        enum: OrganizationDeletionReasonsHelper
    },
    orgDisablitionReason: {
        enum: OrganizationDisablitionReasonsHelper
    },
    orgEnableReason: {
        enum: OrganizationEnableReasonsHelper
    },
    orgUserCreationReason: {
        enum: OrganizationalUserCreationReasonsHelper
    },
    orgUserUpdateReason: {
        enum: OrganizationalUserUpdateReasonsHelper
    },
    orgUserDeletionReason: {
        enum: OrganizationalUserDeletionReasonsHelper
    },
    orgUserDisablitionReason: {
        enum: OrganizationalUserDisablitionReasonsHelper
    },
    orgUserEnableReason: {
        enum: OrganizationalUserEnableReasonsHelper
    },
    description: {
        length: descriptionLength
    },
    adminActivityViewReason: {
        enum: ViewActivityTrackerReasonsHelper
    }
};

module.exports = {
    validationRules
};