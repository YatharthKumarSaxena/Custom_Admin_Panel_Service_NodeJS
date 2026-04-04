const mongoose = require("mongoose");
const { customIdRegex, emailRegex, googleDriveRegex, fileUrlRegex } = require("@configs/regex.config");
const { DB_COLLECTIONS } = require("@/configs/db-collections.config");
const { orgRoleLength, emailLength, urlLength } = require("@/configs/fields-length.config");
const { ProofDocumentTypes, ProofDocumentSources } = require("@/configs/enums.config");

const organizationUserSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: DB_COLLECTIONS.USERS
    },

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_COLLECTIONS.ORGANIZATIONS,
        required: true
    },

    role: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: orgRoleLength.min,
        maxlength: orgRoleLength.max
    },

    workEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: emailRegex,
        minlength: emailLength.min,
        maxlength: emailLength.max,
        required: true
    },

    proofDocument: {
        type: String,
        trim: true,
        minlength: urlLength.min,
        maxlength: urlLength.max,
        default: null,
        validate: {
            validator: function (value) {
                if (!value) return true;

                if (this.proofDocumentSource === ProofDocumentSources.UPLOAD) {
                    return fileUrlRegex.test(value);
                }

                if (this.proofDocumentSource === ProofDocumentSources.GOOGLE_DRIVE) {
                    return googleDriveRegex.test(value);
                }

                return false;
            },
            message: "Invalid proof document URL"
        }
    },

    proofDocumentType: {
        type: String,
        enum: Object.values(ProofDocumentTypes),
        default: null
    },

    proofDocumentSource: {
        type: String,
        enum: Object.values(ProofDocumentSources),
        default: null
    },

    /* ---------------- Status ---------------- */

    isActive: {
        type: Boolean,
        default: true
    },

    deletedAt: {
        type: Date,
        default: null
    },

    deletedBy: {
        type: String,
        match: customIdRegex,
        default: null
    },

    /* ---------------- Admin Info ---------------- */

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

/* ---------------- Index ---------------- */

// Prevent duplicate user-org mapping
organizationUserSchema.index(
    { userId: 1, organizationId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            deletedAt: null
        }
    }
);

/* ---------------- Custom Validations ---------------- */

organizationUserSchema.pre("validate", async function () {

    // deletedAt and deletedBy must exist together
    if ((this.deletedAt && !this.deletedBy) || (!this.deletedAt && this.deletedBy)) {
        throw new Error("deletedAt and deletedBy must be provided together.");
    }

    if (this.proofDocument) {
        if (!this.proofDocumentSource || !this.proofDocumentType) {
            throw new Error("proofDocumentType and proofDocumentSource are required when proofDocument is provided.");
        }
    }

    if (!this.proofDocument && (this.proofDocumentSource || this.proofDocumentType)) {
        throw new Error("proofDocument is required when type or source is provided.");
    }

});

module.exports = {
    OrganizationUserModel: mongoose.model(
        DB_COLLECTIONS.ORGANIZATION_USERS,
        organizationUserSchema
    )
};