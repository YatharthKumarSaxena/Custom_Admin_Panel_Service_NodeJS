# Internal Service Middlewares

This folder contains middleware for **service-to-service authentication** and internal API protection.

---

## 📁 Files

### `verify-service-token.middleware.js`

Middleware for verifying JWT tokens from other microservices (e.g., Auth Service, Payment Service).

---

## 🔐 Service Token Verification

### How It Works

1. **Other services** generate a JWT service token signed with `SERVICE_TOKEN_SECRET`
2. **This service** receives the token via `x-service-token` header
3. **Middleware** verifies:
   - JWT signature (using shared secret)
   - Token type (`service-token`)
   - Expiration
   - Service name (optional whitelist)
4. **On success**: Attaches `req.serviceAuth` with service details
5. **On failure**: Returns 401/403 error response

---

## 🚀 Usage Examples

### 1. Basic Usage (Allow All Services)

```javascript
const { verifyServiceToken } = require("@middlewares/internals/verify-service-token.middleware");

// Apply to all internal routes
router.use("/internal", verifyServiceToken());

// Or specific route
router.post("/internal/sync-admins", verifyServiceToken(), controller);
```

### 2. Restrict to Specific Services

```javascript
const { restrictToServices } = require("@middlewares/internals/verify-service-token.middleware");

// Only allow auth-service
router.post(
  "/internal/verify-admin",
  restrictToServices(["auth-service"]),
  controller
);

// Allow multiple services
router.post(
  "/internal/shared-data",
  restrictToServices(["auth-service", "payment-service", "notification-service"]),
  controller
);
```

### 3. Check Service Name in Controller

```javascript
const { isFromService } = require("@middlewares/internals/verify-service-token.middleware");

const myController = (req, res) => {
  // Check if request is from specific service
  if (isFromService(req, "auth-service")) {
    // Special handling for auth service
  }

  // Access service details
  console.log(req.serviceAuth.serviceName);       // "auth-service"
  console.log(req.serviceAuth.serviceInstanceId); // "auth-prod-01"
  console.log(req.serviceAuth.issuedAt);          // JWT iat timestamp
  console.log(req.serviceAuth.expiresAt);         // JWT exp timestamp
};
```

---

## 🔧 Configuration

### Environment Variables

#### `.env` file

```env
# Service Token Secret (MUST be same across all microservices)
SERVICE_TOKEN_SECRET=your-super-secret-key-keep-it-same-everywhere

# Token Expiry (optional, default: 60m)
SERVICE_TOKEN_EXPIRY=60m

# Allowed Service Names (optional, comma-separated)
# If empty, all services are allowed
ALLOWED_SERVICE_NAMES=auth-service,payment-service,notification-service
```

### Config Files

- **Security Config**: [`src/configs/security.config.js`](../../configs/security.config.js)
  - `SERVICE_TOKEN_SECRET` - Shared secret for JWT signing/verification
  - `SERVICE_TOKEN_EXPIRY` - Token lifetime (e.g., "60m", "1h")
  - `ALLOWED_SERVICE_NAMES` - Global whitelist of allowed services

- **Headers Config**: [`src/configs/headers.config.js`](../../configs/headers.config.js)
  - `SERVICE_HEADERS.SERVICE_TOKEN` = `"x-service-token"` (header name)

---

## 📨 Request Format

### From Other Service

```javascript
const axios = require("axios");

const response = await axios.post(
  "https://admin-service.com/internal/sync-admins",
  { /* request body */ },
  {
    headers: {
      "x-service-token": "<JWT_TOKEN_HERE>"
    }
  }
);
```

### Token Payload Structure

The service token JWT contains:

```json
{
  "serviceName": "auth-service",
  "serviceInstanceId": "auth-prod-01",
  "type": "service-token",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## 🛡️ Security Notes

1. **Never log or expose `SERVICE_TOKEN_SECRET`** in code, logs, or error messages
2. **Same secret across all services** - All interconnected microservices must use the same `SERVICE_TOKEN_SECRET`
3. **Use HTTPS** - Always use TLS/SSL in production
4. **Token rotation** - Services should regularly regenerate tokens (recommended: every 10 minutes)
5. **Whitelist services** - Use `ALLOWED_SERVICE_NAMES` in production to restrict access
6. **Separate from user tokens** - Service tokens are NOT user authentication tokens (type check prevents mixing)

---

## ❌ Error Responses

### 401 Unauthorized (Missing/Invalid Token)

```json
{
  "success": false,
  "message": "Service token is required for this endpoint",
  "error": "MISSING_SERVICE_TOKEN"
}
```

```json
{
  "success": false,
  "message": "Service token has expired",
  "error": "TOKEN_EXPIRED"
}
```

```json
{
  "success": false,
  "message": "Invalid service token signature or format",
  "error": "INVALID_SERVICE_TOKEN"
}
```

### 403 Forbidden (Service Not Allowed)

```json
{
  "success": false,
  "message": "Service 'unknown-service' is not in the allowed services list",
  "error": "SERVICE_NOT_ALLOWED"
}
```

---

## 🧪 Testing

### Manual Testing with cURL

```bash
# Get a service token from your auth service first
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Make request to internal endpoint
curl -X POST https://admin-service.com/internal/sync-admins \
  -H "x-service-token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'
```

### Testing in Code

```javascript
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Generate test token (in auth service or test environment)
const testToken = jwt.sign(
  {
    serviceName: "auth-service",
    serviceInstanceId: "auth-test-01",
    type: "service-token"
  },
  process.env.SERVICE_TOKEN_SECRET,
  { algorithm: "HS256", expiresIn: "1h" }
);

// Make request
const response = await axios.post(
  "http://localhost:3000/internal/test",
  { data: "test" },
  { headers: { "x-service-token": testToken } }
);
```

---

## 📚 Related Files

- **Utility**: [`src/utils/service-token-verifier.util.js`](../../utils/service-token-verifier.util.js)
  - Core verification logic
  - Token validation functions
  
- **Config**: [`src/configs/security.config.js`](../../configs/security.config.js)
  - Service token settings
  
- **Config**: [`src/configs/headers.config.js`](../../configs/headers.config.js)
  - Header name definitions

---

## 🔄 Integration with Other Services

To integrate this service with other microservices:

1. **Share `SERVICE_TOKEN_SECRET`** - Ensure all services use the same secret
2. **Generate tokens in source service** - Use JWT library to create service tokens
3. **Send token in header** - Include `x-service-token` header in requests
4. **Apply middleware** - Protect internal routes with `verifyServiceToken()`
5. **Handle responses** - Check for 401/403 errors and refresh tokens if needed

---

## ⚙️ Advanced Options

### Custom Token Validation

For more complex validation (e.g., database lookup, rate limiting), extend the middleware:

```javascript
const { verifyServiceToken } = require("@middlewares/internals/verify-service-token.middleware");

const customServiceAuth = () => {
  return async (req, res, next) => {
    // First verify token
    const tokenMiddleware = verifyServiceToken();
    tokenMiddleware(req, res, async (err) => {
      if (err) return next(err);

      // Custom logic: Check database
      const service = await ServiceModel.findOne({
        serviceName: req.serviceAuth.serviceName
      });

      if (!service || !service.isActive) {
        return res.status(403).json({
          success: false,
          message: "Service is not active",
          error: "SERVICE_INACTIVE"
        });
      }

      next();
    });
  };
};
```

---

## 📞 Support

For issues or questions, contact the Admin Panel Service team.
