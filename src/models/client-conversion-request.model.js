const mongoose = require("mongoose");

const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { customIdRegex, emailRegex, fileUrlRegex, urlRegex, orgNameRegex } = require("@/configs/regex.config");
const { ClientConversionRequestTypes, ClientConversionRequestStatuses } = require("@/configs/enums.config");
const { ClientConversionRequestReasons } = require("@/configs/reasons.config");
const { descriptionLength, emailLength, orgRoleLength, urlLength, orgNameLength } = require("@/configs/fields-length.config");

const existingOrganizationClaimSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_COLLECTIONS.ORGANIZATIONS,
        required: true
    },
    workEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        match: emailRegex,
        minlength: emailLength.min,
        maxlength: emailLength.max
    },
    designation: {
        type: String,
        trim: true,
        minlength: orgRoleLength.min,
        maxlength: orgRoleLength.max,
        default: null
    },
    proofDocument: {
        type: String,
        trim: true,
        minlength: urlLength.min,
        maxlength: urlLength.max,
        match: fileUrlRegex,
        default: null
    },
    message: {
        type: String,
        trim: true,
        minlength: descriptionLength.min,
        maxlength: descriptionLength.max,
        default: null
    }
}, { _id: false });

const newOrganizationClaimSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        trim: true,
        minlength: orgNameLength.min,
        maxlength: orgNameLength.max,
        match: orgNameRegex
    },
    website: {
        type: String,
        required: true,
        trim: true,
        minlength: urlLength.min,
        maxlength: urlLength.max,
        match: urlRegex
    },
    workEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        match: emailRegex,
        minlength: emailLength.min,
        maxlength: emailLength.max
    },
    designation: {
        type: String,
        trim: true,
        minlength: orgRoleLength.min,
        maxlength: orgRoleLength.max,
        default: null
    },
    proofDocument: {
        type: String,
        trim: true,
        minlength: urlLength.min,
        maxlength: urlLength.max,
        match: fileUrlRegex,
        default: null
    },
    message: {
        type: String,
        trim: true,
        minlength: descriptionLength.min,
        maxlength: descriptionLength.max,
        default: null
    }
}, { _id: false });

const clientConversionRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: DB_COLLECTIONS.USERS
    },
    requestType: {
        type: String,
        enum: Object.values(ClientConversionRequestTypes),
        required: true
    },
    existingOrganizations: {
        type: [existingOrganizationClaimSchema],
        default: []
    },
    newOrganizations: {
        type: [newOrganizationClaimSchema],
        default: []
    },
    status: {
        type: String,
        enum: Object.values(ClientConversionRequestStatuses),
        default: ClientConversionRequestStatuses.PENDING
    },
    conversionReason: {
        type: String,
        enum: Object.values(ClientConversionRequestReasons),
        required: true
    },
    reasonDescription: {
        type: String,
        trim: true,
        minlength: descriptionLength.min,
        maxlength: descriptionLength.max,
        default: null
    },
    createdBy: {
        type: String,
        required: true,
        match: customIdRegex
    },
    updatedBy: {
        type: String,
        match: customIdRegex,
        default: null
    }
}, { timestamps: true, versionKey: false });

clientConversionRequestSchema.index(
    { userId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: ClientConversionRequestStatuses.PENDING }
    }
);

clientConversionRequestSchema.pre("validate", function () {
    const existingCount = this.existingOrganizations?.length || 0;
    const newCount = this.newOrganizations?.length || 0;
    const totalClaims = existingCount + newCount;

    if (this.requestType === ClientConversionRequestTypes.SINGLE_ORGANIZATION) {
        const isValidSingle =
            (existingCount === 1 && newCount === 0) ||
            (existingCount === 0 && newCount === 1);

        if (!isValidSingle) {
            throw new Error("single_organization request must contain exactly one organization claim.");
        }
    }

    if (this.requestType === ClientConversionRequestTypes.MULTIPLE_ORGANIZATIONS) {
        if (totalClaims < 1 || totalClaims > 2) {
            throw new Error("multiple_organizations request must contain 1 to 2 organization claims.");
        }
    }

    if (totalClaims > 2) {
        throw new Error("At most 2 organization claims are allowed in one request.");
    }
});

module.exports = {
    ClientConversionRequestModel: mongoose.model(
        DB_COLLECTIONS.CLIENT_CONVERSION_REQUESTS,
        clientConversionRequestSchema
    )
};
