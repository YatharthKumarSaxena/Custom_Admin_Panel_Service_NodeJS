const { UserModel } = require("@/models/index");
const { UserTypes, FirstNameFieldSetting } = require("@configs/enums.config");
const { SYSTEM_LOG_EVENTS, SERVICE_NAMES } = require("@/configs/system-log-events.config");
const { logWithTime } = require("@utils/time-stamps.util");
const { logSuccess, logFailure, logError } = require("@services/audit/service-tracker.service");
const { errorMessage } = require("@/responses/common/error-handler.response");
const { FIRST_NAME_SETTING } = require("@/configs/security.config");

/**
 * Create User 
 */

const createUserService = async ({ firstName, userId }) => {
  try {

    // 1️⃣ Validate input
    if (!userId) {
      logFailure(
        SERVICE_NAMES.ADMIN_PANEL_SERVICE,
        SYSTEM_LOG_EVENTS.SYNC_USER,
        "CREATE_USER",
        "User creation failed: Missing required fields (userId or firstName)",
        {
          executedBy: "SYSTEM",
          metadata: { userId, firstName }
        }
      );

      return {
        success: false,
        message: "userId is required"
      };
    }

    // 2️⃣ Check if First Name is Optional Or Mandatory or Disabled
    
    if ( FIRST_NAME_SETTING === FirstNameFieldSetting.MANDATORY && !firstName) {
      logFailure(
        SERVICE_NAMES.ADMIN_PANEL_SERVICE,
        SYSTEM_LOG_EVENTS.SYNC_USER,
        "CREATE_USER",
        "User creation failed: First name is mandatory but not provided",
        {
          executedBy: "SYSTEM",
          metadata: { userId }
        }
      );

      return {
        success: false,
        message: "First name is required"
      };
    }
    
    if (FIRST_NAME_SETTING === FirstNameFieldSetting.DISABLED && firstName) {
        logFailure(
            SERVICE_NAMES.ADMIN_PANEL_SERVICE,
            SYSTEM_LOG_EVENTS.SYNC_USER,
            "CREATE_USER",
            "User creation failed: First name is disabled but provided",
            {
                executedBy: "SYSTEM",
                metadata: { userId }
            }
        );

        return {
            success: false,
            message: "First name is disabled"
        };
    }

     // 3️⃣ Check if User already exists
     const existingUser = await UserModel.findOne({ userId });

     if (existingUser) {
       logFailure(
         SERVICE_NAMES.ADMIN_PANEL_SERVICE,
         SYSTEM_LOG_EVENTS.SYNC_USER,
         "CREATE_USER",
         `User already exists: ${existingUser.userId}`,
         {
           executedBy: "SYSTEM",
           targetId: existingUser.userId,
           metadata: { attemptedUserId: userId }
         }
       );

       return {
         success: false,
         type: AuthErr.CONFLICT,
         message: "User already exists"
       };
     }
    // 3️⃣ Create User
    const user = await UserModel.create({
      userId,
      firstName,
      userType: UserTypes.USER,
      isActive: true
    });

    // 4️⃣ Log Success
    logSuccess(
      SERVICE_NAMES.ADMIN_PANEL_SERVICE,
      SYSTEM_LOG_EVENTS.SYNC_USER,
      "CREATE_USER",
      `User created successfully: ${userId}`,
      {
        executedBy: "SYSTEM",
        metadata: {
          userId: user.userId,
          firstName: user.firstName,
          userType: user.userType
        }
      }
    );

    logWithTime(
      `✅ [${SYSTEM_LOG_EVENTS.SYNC_USER}] User created: ${userId}`
    );

    return {
      success: true,
      message: "User created successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        userType: user.userType
      }
    };

  } catch (err) {

    // Log error to service tracker
    logError(
      SERVICE_NAMES.ADMIN_PANEL_SERVICE,
      SYSTEM_LOG_EVENTS.CRITICAL_ERROR,
      "CREATE_USER",
      `User creation failed: ${err.message}`,
      {
        executedBy: "SYSTEM",
        metadata: {
          error: err.message,
          stack: err.stack,
          userId: userId || null
        }
      }
    );

    logWithTime(
      `❌ [${SYSTEM_LOG_EVENTS.CRITICAL_ERROR}] User creation failed: ${err.message}`
    );
    
    errorMessage(err);

    // Return error instead of throwing
    return {
      success: false,
      message: "User creation failed",
      error: err.message
    };
  }
};

module.exports = {
  createUserService
};