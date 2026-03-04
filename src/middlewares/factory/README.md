# Middleware Factory Pattern

This folder contains **factory functions** that create pre-configured middleware instances following the **Factory Design Pattern** (similar to rate limiters).

---

## 📁 Files

### `verify-service.middleware-factory.js`

Factory for creating service token verification middleware with strict service name validation.

---

## 🏭 Factory Pattern

Factory functions accept configuration and return fully-configured middleware.

### Pattern Structure

```javascript
const createMiddleware = ({ config }) => {
  // Validate factory parameters
  
  // Return actual middleware
  return (req, res, next) => {
    // Middleware logic here
  };
};
```

### Benefits

- ✅ **Reusability**: Create multiple middleware instances with different configs
- ✅ **Consistency**: All instances follow same pattern
- ✅ **Type Safety**: Config validation at factory level
- ✅ **Testability**: Easy to test with different configurations

---

## 🔐 Service Verification Factory

### `createVerifyServiceMiddleware(config)`

Creates a middleware that verifies service tokens with **strict comparison** (no trimming, no lowercase).

#### Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `middlewareName` | string | ✅ Yes | Name for logging (e.g., "AuthService") |
| `expectedServiceName` | string | ✅ Yes | Exact service name to match (strict comparison) |
| `expectedToken` | string | ❌ No | Optional exact token value to match |

#### How It Works

1. **Extract token** from `x-service-token` header
2. **Verify JWT** signature and structure
3. **Strict compare** service name (exact match, no modifications)
4. **Attach** `req.serviceAuth` with decoded data
5. **Log errors** using `logMiddlewareError()`
6. **Return errors** using error handler responses

#### Returns

Express middleware function `(req, res, next)`

#### On Success

```javascript
req.serviceAuth = {
  serviceName: "auth-service",
  serviceInstanceId: "auth-prod-01",
  type: "service-token",
  issuedAt: 1234567890,
  expiresAt: 1234571490
}
```

#### On Failure

- **401 Unauthorized**: Missing token, invalid token, expired token
- **403 Forbidden**: Service name mismatch, wrong service

---

## 🚀 Usage Examples

### 1. Create Custom Service Middleware

```javascript
const { createVerifyServiceMiddleware } = require("@middlewares/factory/verify-service.middleware-factory");

// Create middleware for payment service
const paymentServiceMiddleware = createVerifyServiceMiddleware({
  middlewareName: "PaymentService",
  expectedServiceName: "payment-service"
});

// Use in routes
router.post("/internal/process-payment", paymentServiceMiddleware, controller);
```

### 2. Use Pre-configured Middlewares

```javascript
const { 
  authServiceMiddleware, 
  softwareManagementServiceMiddleware 
} = require("@middlewares/factory/verify-service.middleware-factory");

// Auth service only
router.post("/internal/auth/sync", authServiceMiddleware, controller);

// Software management service only
router.post("/internal/software/sync", softwareManagementServiceMiddleware, controller);
```

### 3. Strict Token Comparison (Optional)

```javascript
const strictTokenMiddleware = createVerifyServiceMiddleware({
  middlewareName: "StrictAuth",
  expectedServiceName: "auth-service",
  expectedToken: "exact-token-value-here" // Must match exactly
});

router.post("/internal/critical", strictTokenMiddleware, controller);
```

---

## 📦 Pre-configured Instances

### `authServiceMiddleware`

Restricts access to **auth-service** only.

```javascript
const { authServiceMiddleware } = require("@middlewares/factory/verify-service.middleware-factory");

router.post("/internal/auth/verify-token", authServiceMiddleware, (req, res) => {
  // Only auth-service can access
  res.json({ 
    success: true, 
    calledBy: req.serviceAuth.serviceName 
  });
});
```

**Config:**
- middlewareName: `"AuthService"`
- expectedServiceName: `"auth-service"`

---

### `softwareManagementServiceMiddleware`

Restricts access to **software-management-service** only.

```javascript
const { softwareManagementServiceMiddleware } = require("@middlewares/factory/verify-service.middleware-factory");

router.post("/internal/software/sync-licenses", softwareManagementServiceMiddleware, (req, res) => {
  // Only software-management-service can access
  res.json({ 
    success: true, 
    calledBy: req.serviceAuth.serviceName 
  });
});
```

**Config:**
- middlewareName: `"SoftwareManagementService"`
- expectedServiceName: `"software-management-service"`

---

## 🔍 Strict Comparison

### Service Name Matching

**No modifications applied** - exact string comparison:

```javascript
// ✅ PASS: Exact match
actualServiceName = "auth-service"
expectedServiceName = "auth-service"

// ❌ FAIL: Case mismatch
actualServiceName = "Auth-Service"
expectedServiceName = "auth-service"

// ❌ FAIL: Extra space
actualServiceName = "auth-service "
expectedServiceName = "auth-service"

// ❌ FAIL: Different name
actualServiceName = "authentication-service"
expectedServiceName = "auth-service"
```

### Token Matching (if expectedToken provided)

```javascript
// ✅ PASS: Exact match
actualToken = "abc123xyz"
expectedToken = "abc123xyz"

// ❌ FAIL: Case mismatch
actualToken = "ABC123XYZ"
expectedToken = "abc123xyz"

// ❌ FAIL: Extra characters
actualToken = "abc123xyz "
expectedToken = "abc123xyz"
```

---

## 📝 Logging

The factory uses `logMiddlewareError()` for consistent logging:

```javascript
logMiddlewareError(
  middlewareName,  // e.g., "AuthService"
  reason,          // e.g., "Service token missing"
  req              // Express request object
);
```

**Log Format:**
```
❌ [AuthServiceMiddleware] Error: Service name mismatch. Expected: 'auth-service', Got: 'other-service' | user: (UNKNOWN_USER) | device: (UNKNOWN_DEVICE)
```

---

## ⚠️ Error Responses

### Missing Token (401)

```json
{
  "success": false,
  "message": "Service token is required for this endpoint",
  "error": "MISSING_SERVICE_TOKEN"
}
```

### Expired Token (401)

```json
{
  "success": false,
  "message": "Service token has expired",
  "error": "TOKEN_EXPIRED"
}
```

### Invalid Token (403)

```json
{
  "success": false,
  "message": "Invalid service token signature or format",
  "error": "INVALID_SERVICE_TOKEN"
}
```

### Service Name Mismatch (403)

```json
{
  "success": false,
  "type": "AccessDenied",
  "warning": "This endpoint is restricted to 'auth-service' service only",
  "message": "You do not have the necessary permissions to perform this action."
}
```

---

## 🧪 Testing

### Test Factory Creation

```javascript
const { createVerifyServiceMiddleware } = require("@middlewares/factory/verify-service.middleware-factory");

// Should throw error for missing config
try {
  const middleware = createVerifyServiceMiddleware({});
} catch (err) {
  console.log(err.message); 
  // "createVerifyServiceMiddleware: middlewareName is required and must be a string"
}
```

### Test Middleware

```javascript
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Generate test token
const testToken = jwt.sign(
  {
    serviceName: "auth-service",
    serviceInstanceId: "auth-test-01",
    type: "service-token"
  },
  process.env.SERVICE_TOKEN_SECRET,
  { algorithm: "HS256", expiresIn: "1h" }
);

// Test endpoint
const response = await axios.post(
  "http://localhost:3000/internal/auth/sync",
  { data: "test" },
  { headers: { "x-service-token": testToken } }
);

console.log(response.data); // Should succeed
```

---

## 🔗 Related Files

- **Utility**: [`src/utils/service-token-verifier.util.js`](../../utils/service-token-verifier.util.js) - Token verification logic
- **Config**: [`src/configs/security.config.js`](../../configs/security.config.js) - Service token settings
- **Config**: [`src/configs/headers.config.js`](../../configs/headers.config.js) - Header definitions
- **Error Handlers**: [`src/responses/common/error-handler.response.js`](../../responses/common/error-handler.response.js) - Error responses
- **Logging**: [`src/utils/log-error.util.js`](../../utils/log-error.util.js) - Logging utilities

---

## 🎯 Best Practices

1. **Use factory for specific service restrictions**
   ```javascript
   // ✅ Good: Specific service needed
   router.post("/internal/auth/sync", authServiceMiddleware, controller);
   ```

2. **Use general middleware for multiple services**
   ```javascript
   // ✅ Good: Multiple services allowed
   const { restrictToServices } = require("@middlewares/internals/verify-service-token.middleware");
   router.post("/internal/health", restrictToServices(["auth-service", "payment-service"]), controller);
   ```

3. **Name middleware descriptively**
   ```javascript
   const notificationServiceMiddleware = createVerifyServiceMiddleware({
     middlewareName: "NotificationService", // Clear and descriptive
     expectedServiceName: "notification-service"
   });
   ```

4. **Document service requirements in routes**
   ```javascript
   /**
    * @route   POST /internal/auth/sync
    * @desc    Sync authentication data
    * @access  Internal (auth-service ONLY)
    */
   router.post("/auth/sync", authServiceMiddleware, controller);
   ```

---

## 📞 Support

For issues or questions, contact the Admin Panel Service team.
