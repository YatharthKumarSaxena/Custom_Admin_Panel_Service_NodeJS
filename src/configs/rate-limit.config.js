// configs/rate-limit.config.js

module.exports = {
  perDevice: {
    malformedRequest: {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1 minute
      prefix: "malformed_request",
      reason: "Malformed request",
      message: "Too many malformed requests. Fix your payload and try again later."
    },

    unknownRoute: {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      prefix: "unknown_route",
      reason: "Unknown route access",
      message: "Too many invalid or unauthorized requests."
    }

  },

  perUserAndDevice: {
    createAdmin: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "create_admin",
      reason: "Excessive admin creation attempts",
      message: "You have exceeded the maximum number of admin creation attempts. Please try again later."
    },
    createClient: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "create_client",
      reason: "Excessive client creation attempts",
      message: "You have exceeded the maximum number of client creation attempts. Please try again later."
    },
    convertUserToClient: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "convert_user_to_client",
      reason: "Excessive user conversion attempts",
      message: "You have exceeded the maximum number of user conversion attempts. Please try again later."
    },
    blockAdmin: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "block_admin",
      reason: "Excessive admin blocking attempts",
      message: "You have exceeded the maximum number of admin blocking attempts. Please try again later."
    },
    unblockAdmin: {
      maxRequests: 30,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "unblock_admin",
      reason: "Excessive admin unblocking attempts",
      message: "You have exceeded the maximum number of admin unblocking attempts. Please try again later."
    },
    blockUser: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "block_user",
      reason: "Excessive user blocking attempts",
      message: "You have exceeded the maximum number of user blocking attempts. Please try again later."
    },
    unblockUser: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "unblock_user",
      reason: "Excessive user unblocking attempts",
      message: "You have exceeded the maximum number of user unblocking attempts. Please try again later."
    },
    blockDevice: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "block_device",
      reason: "Excessive device blocking attempts",
      message: "You have exceeded the maximum number of device blocking attempts. Please try again later."
    },
    unblockDevice: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "unblock_device",
      reason: "Excessive device unblocking attempts",
      message: "You have exceeded the maximum number of device unblocking attempts. Please try again later."
    },
    createOrganization: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "create_organization",
      reason: "Excessive organization creation attempts",
      message: "You have exceeded the maximum number of organization creation attempts. Please try again later."
    },
    updateOrganization: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "update_organization",
      reason: "Excessive organization update attempts",
      message: "You have exceeded the maximum number of organization update attempts. Please try again later."
    },
    deleteOrganization: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "delete_organization",
      reason: "Excessive organization deletion attempts",
      message: "You have exceeded the maximum number of organization deletion attempts. Please try again later."
    },
    disableOrganization: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "disable_organization",
      reason: "Excessive organization disable attempts",
      message: "You have exceeded the maximum number of organization disable attempts. Please try again later."
    },
    enableOrganization: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "enable_organization",
      reason: "Excessive organization enable attempts",
      message: "You have exceeded the maximum number of organization enable attempts. Please try again later."
    },
    getOrganization: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "get_organization",
      reason: "Excessive organization retrieval attempts",
      message: "You have exceeded the maximum number of organization retrieval attempts. Please try again later."
    },
    listOrganizations: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "list_organizations",
      reason: "Excessive organization listing attempts",
      message: "You have exceeded the maximum number of organization listing attempts. Please try again later."
    },
    createOrgUser: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "create_org_user",
      reason: "Excessive organization user creation attempts",
      message: "You have exceeded the maximum number of organization user creation attempts. Please try again later."
    },
    updateOrgUser: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "update_org_user",
      reason: "Excessive organization user update attempts",
      message: "You have exceeded the maximum number of organization user update attempts. Please try again later."
    },
    deleteOrgUser: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "delete_org_user",
      reason: "Excessive organization user deletion attempts",
      message: "You have exceeded the maximum number of organization user deletion attempts. Please try again later."
    },
    disableOrgUser: {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "disable_org_user",
      reason: "Excessive organization user disable attempts",
      message: "You have exceeded the maximum number of organization user disable attempts. Please try again later."
    },
    enableOrgUser: {
      maxRequests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "enable_org_user",
      reason: "Excessive organization user enable attempts",
      message: "You have exceeded the maximum number of organization user enable attempts. Please try again later."
    },
    getOrgUser: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "get_org_user",
      reason: "Excessive organization user retrieval attempts",
      message: "You have exceeded the maximum number of organization user retrieval attempts. Please try again later."
    },
    listOrgUsers: {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
      prefix: "list_org_users",
      reason: "Excessive organization user listing attempts",
      message: "You have exceeded the maximum number of organization user listing attempts. Please try again later."
    }
  }
};