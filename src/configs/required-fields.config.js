/**
 * REQUIRED FIELDS CONFIG (Auto-Generated)
 * 
 * DO NOT MANUALLY EDIT THIS FILE!
 * 
 * These arrays are automatically derived from:
 * @see field-definitions.config.js (Single Source of Truth)
 * 
 * To add/remove/modify required fields:
 * → Edit FieldDefinitions in field-definitions.config.js
 * → Changes will automatically reflect here
 */

const { getRequiredFields } = require("@/utils/field-definition.util");
const { FieldDefinitions } = require("./field-definitions.config");

const requiredFields = {
    createAdminField: getRequiredFields(FieldDefinitions.CREATE_ADMIN),
    createClientField: getRequiredFields(FieldDefinitions.CREATE_CLIENT),
    convertUserToClientField: getRequiredFields(FieldDefinitions.CONVERT_USER_TO_CLIENT),
    blockAdminField: getRequiredFields(FieldDefinitions.BLOCK_ADMIN),
    unblockAdminField: getRequiredFields(FieldDefinitions.UNBLOCK_ADMIN),
    blockUserField: getRequiredFields(FieldDefinitions.BLOCK_USER),
    unblockUserField: getRequiredFields(FieldDefinitions.UNBLOCK_USER),
    blockDeviceField: getRequiredFields(FieldDefinitions.BLOCK_DEVICE),
    unblockDeviceField: getRequiredFields(FieldDefinitions.UNBLOCK_DEVICE),

    createOrganizationField: getRequiredFields(FieldDefinitions.CREATE_ORGANIZATION),
    updateOrganizationField: getRequiredFields(FieldDefinitions.UPDATE_ORGANIZATION),
    deleteOrganizationField: getRequiredFields(FieldDefinitions.DELETE_ORGANIZATION),
    disableOrganizationField: getRequiredFields(FieldDefinitions.DISABLE_ORGANIZATION),
    enableOrganizationField: getRequiredFields(FieldDefinitions.ENABLE_ORGANIZATION),

    createOrganizationalUserField: getRequiredFields(FieldDefinitions.CREATE_ORG_USER),
    updateOrganizationalUserField: getRequiredFields(FieldDefinitions.UPDATE_ORG_USER),
    deleteOrganizationalUserField: getRequiredFields(FieldDefinitions.DELETE_ORG_USER),
    disableOrganizationalUserField: getRequiredFields(FieldDefinitions.DISABLE_ORG_USER),
    enableOrganizationalUserField: getRequiredFields(FieldDefinitions.ENABLE_ORG_USER),

    getAdminActivitiesField: getRequiredFields(FieldDefinitions.GET_ADMIN_ACTIVITIES)
};
module.exports = {
    requiredFields
};