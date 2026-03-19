const { AdminTypes } = require("./enums.config");

const ADMIN_ROUTE_AUTHORIZATION = {

    /* ---------------- Admin Routes ---------------- */

    CREATE_ADMIN: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    CREATE_CLIENT: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ],

    CONVERT_USER_TO_CLIENT: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    GET_ADMIN: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.INTERNAL_ADMIN,
        AdminTypes.AUDIT_ADMIN
    ],

    UPDATE_ADMIN: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    DELETE_ADMIN: [
        AdminTypes.SUPER_ADMIN
    ],

    BLOCK_ADMIN: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    UNBLOCK_ADMIN: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ]

};

const DEVICE_ROUTE_AUTHORIZATION = {
    BLOCK_DEVICE: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],
    
    UNBLOCK_DEVICE: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ]
};

const USER_ROUTE_AUTHORIZATION = {
    BLOCK_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ],

    UNBLOCK_USERS: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ]
};

const ORGANIZATION_ROUTE_AUTHORIZATION = {
    /* ---------------- Organization Routes ---------------- */

    CREATE_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    UPDATE_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ],

    DELETE_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    GET_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN,
        AdminTypes.SUPPORT_ADMIN,
        AdminTypes.AUDIT_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    LIST_ORGANIZATIONS: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN,
        AdminTypes.SUPPORT_ADMIN,
        AdminTypes.AUDIT_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    /* ---------------- Organization User Routes ---------------- */

    CREATE_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ],

    UPDATE_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN
    ],

    DELETE_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    GET_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN,
        AdminTypes.SUPPORT_ADMIN,
        AdminTypes.AUDIT_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    LIST_ORGANIZATION_USERS: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN,
        AdminTypes.OPERATIONS_ADMIN,
        AdminTypes.SUPPORT_ADMIN,
        AdminTypes.AUDIT_ADMIN,
        AdminTypes.INTERNAL_ADMIN
    ],

    DISABLE_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN
    ],

    ENABLE_ORGANIZATION: [
        AdminTypes.SUPER_ADMIN
    ],

    DISABLE_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ],

    ENABLE_ORGANIZATION_USER: [
        AdminTypes.SUPER_ADMIN,
        AdminTypes.ORG_ADMIN
    ]
}

module.exports = {
    ADMIN_ROUTE_AUTHORIZATION,
    ORGANIZATION_ROUTE_AUTHORIZATION,
    DEVICE_ROUTE_AUTHORIZATION,
    USER_ROUTE_AUTHORIZATION
}