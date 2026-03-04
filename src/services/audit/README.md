# Audit Services

This directory contains audit and logging services for tracking system and user activities.

## Services

### 1. Activity Tracker Service (`activity-tracker.service.js`)

Tracks **user/admin authentication and authorization activities**.

**Use Cases:**
- Admin login/logout
- Password changes
- Permission modifications
- User management actions
- Device-based activity tracking

**Example:**
```javascript
const { logActivityTrackerEvent } = require("@services/audit/activity-tracker.service");

logActivityTrackerEvent(
  admin,      // { adminId, adminType }
  device,     // { deviceUUID, deviceType, deviceName }
  requestId,  // x-request-id from header
  ACTIVITY_TRACKER_EVENTS.ADMIN_LOGIN,
  "Admin logged in successfully",
  {
    oldData: null,
    newData: { lastLogin: new Date() },
    adminActions: {
      targetId: "user-123",
      performedOn: "USER",
      reason: "Account activation"
    }
  }
);
```

---

### 2. Service Tracker Service (`service-tracker.service.js`) ✨ NEW

Tracks **system-level events, microservice operations, and internal processes**.

**Use Cases:**
- Bootstrap operations (creating super admin)
- Cron job executions
- Internal API calls between microservices
- Database operations
- Service errors and failures
- System startup/shutdown

**Key Features:**
- 🔥 **Fire-and-forget**: Non-blocking, async logging
- 🏢 **Distributed system support**: Tracks server instance (hostname:pid)
- 🔍 **Request tracing**: Links logs via request ID
- 📊 **Status tracking**: SUCCESS/FAILURE/ERROR/WARNING/PENDING
- 🎯 **Target tracking**: Tracks what was affected (userId, adminId, etc.)

---

## Service Tracker Usage

### Basic Usage

```javascript
const { logServiceTrackerEvent } = require("@services/audit/service-tracker.service");
const { SYSTEM_LOG_EVENTS, SERVICE_NAMES } = require("@configs/system-log-events.config");

// Log a system event
logServiceTrackerEvent({
  serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
  eventType: SYSTEM_LOG_EVENTS.BOOTSTRAP_SUPER_ADMIN,
  action: "CREATE_SUPER_ADMIN",
  description: "Super admin created successfully",
  status: STATUS_TYPES.SUCCESS,
  targetId: "super-admin-001",
  executedBy: "SYSTEM",
  metadata: { adminId: "super-admin-001", firstName: "John" }
});
```

### With Express Request (HTTP Context)

```javascript
const { logServiceTrackerEvent } = require("@services/audit/service-tracker.service");

// Automatically extracts: IP, User-Agent, x-request-id, x-service-name
logServiceTrackerEvent({
  serviceName: SERVICE_NAMES.ADMIN_PANEL_SERVICE,
  eventType: SYSTEM_LOG_EVENTS.INTERNAL_API_CALL,
  action: "SYNC_USERS",
  description: "User sync completed from Auth Service",
  targetId: "batch-123"
}, req); // Pass Express req object
```

### Shorthand Methods

```javascript
const { logSuccess, logFailure, logError } = require("@services/audit/service-tracker.service");

// ✅ Log success
logSuccess(
  SERVICE_NAMES.ADMIN_PANEL_SERVICE,
  SYSTEM_LOG_EVENTS.CRON_EXECUTION,
  "CLEANUP_SESSIONS",
  "Expired sessions cleaned successfully",
  { metadata: { deletedCount: 45 } }
);

// ❌ Log failure
logFailure(
  SERVICE_NAMES.ADMIN_PANEL_SERVICE,
  SYSTEM_LOG_EVENTS.TOKEN_VERIFICATION_FAILED,
  "VERIFY_TOKEN",
  "Token verification failed: expired",
  { targetId: "token-xyz" }
);

// 🔥 Log error
logError(
  SERVICE_NAMES.ADMIN_PANEL_SERVICE,
  SYSTEM_LOG_EVENTS.CRITICAL_ERROR,
  "DATABASE_CONNECTION",
  "Database connection lost",
  { metadata: { error: err.message } }
);
```

---

## Service Design Pattern

### ✅ Best Practice: Return `{ success: false }` (No throw in services)

Services should **never throw errors**. Always return structured responses.

**Why?**
- ✅ Consistent error handling
- ✅ Easier testing
- ✅ Better error logging
- ✅ No try-catch hell in controllers

**Example:**

```javascript
const createSuperAdmin = async ({ adminId, firstName }) => {
  try {
    // Validation
    if (!adminId || !firstName) {
      logFailure(...);
      return { success: false, message: "Missing required fields" };
    }

    // Business logic
    const superAdmin = await AdminModel.create({ ... });

    // Log success
    logSuccess(...);

    return {
      success: true,
      message: "Super admin created successfully",
      data: { adminId: superAdmin.adminId }
    };

  } catch (err) {
    // Log error
    logError(...);
    errorMessage(err);

    // Return error (DON'T THROW)
    return {
      success: false,
      message: "Super admin creation failed",
      error: err.message
    };
  }
};
```

---

## Configuration

### Event Types (`SYSTEM_LOG_EVENTS`)

Defined in [`@configs/system-log-events.config.js`](../../configs/system-log-events.config.js)

- `BOOTSTRAP_SUPER_ADMIN` - Super admin creation
- `CRON_EXECUTION` - Cron job runs
- `INTERNAL_API_CALL` - Microservice calls
- `TOKEN_VERIFICATION_FAILED` - Token errors
- `CRITICAL_ERROR` - System failures
- _And more..._

### Service Names (`SERVICE_NAMES`)

- `ADMIN_PANEL_SERVICE`
- `AUTH_SERVICE`
- `SOFTWARE_MANAGEMENT_SERVICE`

### Status Types (`STATUS_TYPES`)

- `SUCCESS` - Operation completed successfully
- `FAILURE` - Operation failed (business logic)
- `ERROR` - System/technical error
- `WARNING` - Non-critical issue
- `PENDING` - Operation in progress

---

## Data Structure

### ServiceTrackerModel Schema

```javascript
{
  serviceName: "ADMIN_PANEL_SERVICE",        // Which service?
  serverInstanceId: "server-01:12345",       // Which instance? (hostname:pid)
  sourceService: "AUTH_SERVICE",             // Calling service (microservices)
  requestId: "req-abc123",                   // Request tracing ID
  eventType: "BOOTSTRAP_SUPER_ADMIN",        // Event category
  action: "CREATE_SUPER_ADMIN",              // Specific action
  status: "SUCCESS",                         // Status
  description: "Super admin created",        // Human-readable message
  targetId: "super-admin-001",               // What was affected?
  executedBy: "SYSTEM",                      // Who executed? (userId/adminId/SYSTEM)
  ipAddress: "192.168.1.1",                  // Client IP (if HTTP request)
  userAgent: "Mozilla/5.0...",               // User agent (if HTTP request)
  metadata: { adminId: "...", ... },         // Additional data
  createdAt: "2026-03-04T10:30:00Z",         // Auto timestamp
  updatedAt: "2026-03-04T10:30:00Z"          // Auto timestamp
}
```

---

## Querying Logs

### Find all bootstrap events

```javascript
const logs = await ServiceTrackerModel.find({
  eventType: SYSTEM_LOG_EVENTS.BOOTSTRAP_SUPER_ADMIN
}).sort({ createdAt: -1 });
```

### Find failed operations

```javascript
const failures = await ServiceTrackerModel.find({
  status: STATUS_TYPES.FAILURE,
  createdAt: { $gte: startDate, $lte: endDate }
});
```

### Track specific server instance

```javascript
const serverLogs = await ServiceTrackerModel.find({
  serverInstanceId: "server-01:12345"
}).sort({ createdAt: -1 });
```

### Trace request across services

```javascript
const trace = await ServiceTrackerModel.find({
  requestId: "req-abc123"
}).sort({ createdAt: 1 });
```

---

## Comparison: Activity Tracker vs Service Tracker

| Feature | Activity Tracker | Service Tracker |
|---------|------------------|-----------------|
| **Purpose** | User/Admin actions | System/Service operations |
| **Scope** | Authentication & Authorization | Internal operations, cron, APIs |
| **Example** | Admin login, password change | Super admin creation, cron runs |
| **User Context** | Always has admin/device | May be SYSTEM/CRON |
| **Request Context** | Always HTTP | May be internal/scheduled |

---

## References

- [Service Tracker Model](../../models/service-tracker.model.js)
- [Activity Tracker Model](../../models/activity-tracker.model.js)
- [System Log Events Config](../../configs/system-log-events.config.js)
- [Server Instance Util](../../utils/server-instance.util.js)
