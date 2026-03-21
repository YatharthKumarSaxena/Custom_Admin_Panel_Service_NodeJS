/**
 * VALIDATION SETS CONFIG (Auto-Generated)
 * 
 * DO NOT MANUALLY EDIT THIS FILE!
 * 
 * These validation sets are automatically derived from:
 * @see field-definitions.config.js (Single Source of Truth)
 * 
 * To add/remove/modify validation rules:
 * → Edit FieldDefinitions in field-definitions.config.js
 * → Changes will automatically reflect here
 */

const { getValidationSet } = require("@/utils/field-definition.util");
const { FieldDefinitions } = require("./field-definitions.config");

// AUTO-GENERATED VALIDATION SETS

const validationSets = {
    createAdmin: getValidationSet(FieldDefinitions.CREATE_ADMIN),
    createClient: getValidationSet(FieldDefinitions.CREATE_CLIENT),
    convertUserToClient: getValidationSet(FieldDefinitions.CONVERT_USER_TO_CLIENT),
    blockAdmin: getValidationSet(FieldDefinitions.BLOCK_ADMIN),
    unblockAdmin: getValidationSet(FieldDefinitions.UNBLOCK_ADMIN),
    blockUser: getValidationSet(FieldDefinitions.BLOCK_USER),
    unblockUser: getValidationSet(FieldDefinitions.UNBLOCK_USER),
    blockDevice: getValidationSet(FieldDefinitions.BLOCK_DEVICE),
    unblockDevice: getValidationSet(FieldDefinitions.UNBLOCK_DEVICE),
    createOrganization: getValidationSet(FieldDefinitions.CREATE_ORGANIZATION),
    updateOrganization: getValidationSet(FieldDefinitions.UPDATE_ORGANIZATION),
    deleteOrganization: getValidationSet(FieldDefinitions.DELETE_ORGANIZATION),
    disableOrganization: getValidationSet(FieldDefinitions.DISABLE_ORGANIZATION),
    enableOrganization: getValidationSet(FieldDefinitions.ENABLE_ORGANIZATION),
    createOrganizationalUser: getValidationSet(FieldDefinitions.CREATE_ORG_USER),
    updateOrganizationalUser: getValidationSet(FieldDefinitions.UPDATE_ORG_USER),
    deleteOrganizationalUser: getValidationSet(FieldDefinitions.DELETE_ORG_USER),
    disableOrganizationalUser: getValidationSet(FieldDefinitions.DISABLE_ORG_USER),
    enableOrganizationalUser: getValidationSet(FieldDefinitions.ENABLE_ORG_USER),
    getAdminActivities: getValidationSet(FieldDefinitions.GET_ADMIN_ACTIVITIES)
};

module.exports = {
  validationSets
};