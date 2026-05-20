# 📂 Source Code Structure (`src/`) Guide

This directory contains all the application logic for the Custom Admin Panel Service. This guide will help you navigate the codebase and understand the main components.

---

## 📋 Table of Contents

- [Quick Navigation](#quick-navigation)
- [Directory Structure](#directory-structure)
- [Core Components](#core-components)
- [Component Details](#component-details)
- [Architecture Pattern](#architecture-pattern)
- [How to Add New Features](#how-to-add-new-features)

---

## 🗺️ Quick Navigation

| What You Need | Location | Purpose |
|---------------|----------|---------|
| Define API routes | `routes/` | Endpoint definitions |
| Handle requests | `controllers/` | Request processing logic |
| Business logic | `services/` | Core service implementations |
| Database models | `models/` | MongoDB schemas |
| Input validation | `middlewares/` | Validation & authorization |
| Settings & constants | `configs/` | Configuration values |
| Utility functions | `utils/` | Helper functions |
| API responses | `responses/` | Response formatting |
| Rate limits | `rate-limiters/` | Request throttling |
| Scheduled tasks | `cron-jobs/` | Automated tasks |
| Microservice comms | `internals/` | Internal service calls |

---

## 📁 Directory Structure

```
src/
├── app.js                              # ⭐ Express app setup
├── bootstrap/                          # Initialization scripts
├── configs/                            # Configuration files (25+ config files)
├── controllers/                        # Request handlers (8 modules)
├── cron-jobs/                          # Scheduled tasks
├── internals/                          # Microservice communication
├── middlewares/                        # Custom middleware functions
├── models/                             # MongoDB schemas (10 models)
├── rate-limiters/                      # Rate limiting strategies
├── responses/                          # Response formatters
├── routes/                             # API route definitions
├── services/                           # Business logic layer
└── utils/                              # Utility & helper functions
```

---

## 🏗️ Core Components

### 1. **app.js** - Application Entry Point

```javascript
// Core Express configuration
// Initializes middleware stack in correct order:
// 1. CORS middleware
// 2. Global rate limiter
// 3. JSON parser
// 4. Cookie parser
// 5. Malformed JSON handler
// 6. Routes
// 7. Unknown route handler
```

**Key Points:**
- Middleware order is **critical** for proper functionality
- CORS must be first
- Routes are mounted here
- Global rate limiter protects all endpoints

---

### 2. **routes/** - API Endpoint Definitions

**Files:**
```
routes/
├── index.js                      # Main route aggregator
├── admin.routes.js               # Admin endpoints
├── user.routes.js                # User endpoints
├── organization.routes.js        # Organization endpoints
├── organization-users.routes.js  # Org-user relationships
├── device.routes.js              # Device endpoints
├── activity-tracker.routes.js    # Activity tracking
├── client-conversion-request.routes.js  # Conversion requests
├── internal.routes.js            # Microservice internal routes
└── middleware.gateway.routes.js  # Gateway middlewares
```

**Pattern:**
```javascript
router.get('/path', middlewares, controller.method);
router.post('/path', middlewares, controller.method);
```

---

### 3. **controllers/** - Request Handlers

**Responsibility:** Process incoming requests and call appropriate services

**Modules:**
```
controllers/
├── admins/                  # Admin request handlers
├── users/                   # User request handlers
├── organizations/           # Organization handlers
├── organization-users/      # Org-user handlers
├── devices/                 # Device handlers
├── activity-trackers/       # Activity tracking handlers
├── client-conversion-requests/  # Conversion handlers
└── internals/              # Internal API handlers
```

**Typical Controller Pattern:**
```javascript
exports.createAdmin = async (req, res) => {
    try {
        const data = req.body;
        const result = await adminService.createAdmin(data);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};
```

---

### 4. **services/** - Business Logic Layer

**Responsibility:** Core business logic, database operations, external service calls

**Modules:**
```
services/
├── admins/                 # Admin business logic
├── users/                  # User business logic
├── organizations/          # Organization business logic
├── organizational-users/   # Org-user business logic
├── devices/                # Device business logic
├── activity-trackers/      # Activity tracking logic
├── client-conversion-requests/  # Conversion logic
├── common/                 # Shared service utilities
├── audit/                  # Audit logging
├── internals/              # Internal service calls
└── bootstrap/              # Initialization services
```

**Key Service:**
```javascript
// microservice-init.service.js
// Initializes microservice communication with:
// - Custom Auth Service
// - Other dependent microservices
// - Token rotation scheduler
```

**Typical Service Pattern:**
```javascript
exports.createAdmin = async (adminData) => {
    // 1. Validate input
    // 2. Check for duplicates
    // 3. Encrypt sensitive data
    // 4. Create in database
    // 5. Return result or throw error
};
```

---

### 5. **models/** - Database Schemas

**MongoDB Models:**
```
models/
├── admin.model.js              # Admin schema
├── user.model.js               # User schema
├── organization.model.js       # Organization schema
├── organizational-user.model.js # Org-user relationship
├── device.model.js             # Device schema
├── activity-tracker.model.js   # Activity log schema
├── client-conversion-request.model.js  # Conversion schema
├── service-token.model.js      # Service token schema
├── service-tracker.model.js    # Service tracking
└── index.js                    # Export all models
```

**Schema Example:**
```javascript
const adminSchema = new Schema({
    email: { type: String, unique: true },
    name: String,
    role: String,
    permissions: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

---

### 6. **middlewares/** - Request Processing

**Purpose:** Validate, authorize, and preprocess requests

**Categories:**
```
middlewares/
├── admins/                 # Admin-specific middleware
├── users/                  # User-specific middleware
├── organizations/          # Organization-specific middleware
├── devices/                # Device-specific middleware
├── client-conversion-requests/  # Conversion-specific
├── activity-trackers/      # Activity-specific
├── common/                 # Shared middleware
├── handlers/               # Error handlers
├── factory/                # Middleware factories
└── internals/              # Microservice validation
```

**Common Middleware:**
```
common/
├── auth-token-validator.middleware.js    # Validate JWT
├── role-permission-validator.middleware.js # Check permissions
├── input-validation.middleware.js         # Validate input
├── normalize-request.middleware.js        # Normalize data
```

**Pattern:**
```javascript
exports.validateAdmin = (req, res, next) => {
    if (!req.body.email || !req.body.name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
};
```

---

### 7. **configs/** - Configuration Files

**25+ Configuration Files:**
```
configs/
├── db.config.js                # Database connection
├── redis.config.js             # Redis setup
├── server.config.js            # Server settings
├── headers.config.js           # HTTP headers
├── api-role-permission.config.js # Role permissions
├── role-transitions.config.js  # Role workflow
├── validation.config.js        # Validation rules
├── validation-sets.config.js   # Input validation schemas
├── regex.config.js             # Regex patterns
├── http-status.config.js       # HTTP status codes
├── service-error.config.js     # Error messages
├── microservice.config.js      # Microservice endpoints
├── internal-uri.config.js      # Internal URIs
├── token.config.js             # JWT configuration
├── rate-limit.config.js        # Rate limit settings
├── security.config.js          # Security settings
├── enums.config.js             # Enumerations
├── db-collections.config.js    # Collection names
├── field-definitions.config.js # Field metadata
├── fields-length.config.js     # Field length limits
├── required-fields.config.js   # Required field lists
├── tracker.config.js           # Tracking configuration
├── system-log-events.config.js # Log events
└── README.md                   # Config documentation
```

**Usage Pattern:**
```javascript
const { DB_URL } = require("@configs/db.config");
const { ADMIN_PERMISSIONS } = require("@configs/api-role-permission.config");
```

---

### 8. **responses/** - Response Formatting

**Standardized API Responses:**
```
responses/
├── common/                 # Common response handlers
│   ├── error-handler.response.js
│   ├── success-response.js
│   └── validation-error.response.js
├── success/                # Success response templates
└── internals/              # Internal service responses
```

**Pattern:**
```javascript
// Send standardized success response
res.status(200).json({
    success: true,
    data: result,
    message: 'Operation successful'
});

// Send standardized error response
res.status(400).json({
    success: false,
    error: 'Error message',
    code: 'ERROR_CODE'
});
```

---

### 9. **rate-limiters/** - Request Throttling

**Files:**
```
rate-limiters/
├── global.rate-limiter.js          # Global rate limiter (100 req/10 min)
├── general-api.rate-limiter.js     # General API limit
├── create.rate-limiter.js          # Create operation limit
├── device-based.rate-limiter.js    # Device creation limit
├── create-redis-device.rate-limiter.js  # Redis device limit
└── README.md
```

**Usage:**
```javascript
router.post('/create', createRateLimiter, controller.create);
```

---

### 10. **cron-jobs/** - Scheduled Tasks

**Purpose:** Automated background tasks

**Implementation:**
```
cron-jobs/
├── index.js           # Main cron scheduler
└── README.md
```

**Examples of scheduled tasks:**
- Token rotation (via `setupTokenRotationScheduler`)
- Activity log cleanup
- Cache refresh
- Database maintenance

---

### 11. **internals/** - Microservice Communication

**Purpose:** Handle inter-microservice requests

```
internals/
├── index.js                           # Internal routes
├── microservice.guard.js              # Security guard
├── constants/                         # Constants
├── internal-client/                   # Client setup
├── redis-session/                     # Session management
├── service-token/                     # Token handling
└── README.md
```

**Key Feature:** `microservice.guard.js`
- Validates internal service tokens
- Ensures secure microservice-to-microservice communication

---

### 12. **utils/** - Helper Functions

**Common utilities:**
```
utils/
├── time-stamps.util.js         # Timestamp handling (logWithTime)
├── data-validation.util.js     # Input validation
├── encryption.util.js          # Data encryption
├── token.util.js               # Token operations
├── response.util.js            # Response helpers
├── array.util.js               # Array operations
├── object.util.js              # Object operations
└── string.util.js              # String operations
```

---

## 🏛️ Architecture Pattern

The application follows the **MVC (Model-View-Controller) + Services** pattern:

```
Request
  ↓
Routes (Endpoint definition)
  ↓
Middlewares (Validation & Authorization)
  ↓
Controllers (Request handler)
  ↓
Services (Business logic)
  ↓
Models (Database operations)
  ↓
Response (Formatted output)
```

**Data Flow Example:**
```
POST /api/admins
  → admin.routes.js (route definition)
  → validateAdmin middleware (check permissions)
  → adminController.createAdmin (handle request)
  → adminService.createAdmin (business logic)
  → Admin.create() (database operation)
  → success response
```

---

## ➕ How to Add New Features

### Example: Add a New "Reports" Module

#### Step 1: Create Routes
**File:** `routes/report.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const reportController = require('@controllers/reports');
const { validateReport } = require('@middlewares/reports');

router.get('/', reportController.getAllReports);
router.post('/', validateReport, reportController.createReport);

module.exports = router;
```

#### Step 2: Register Routes
**File:** `routes/index.js`
```javascript
const reportRoutes = require('./report.routes');
app.use('/api/reports', reportRoutes);
```

#### Step 3: Create Controller
**File:** `controllers/reports/report.controller.js`
```javascript
exports.getAllReports = async (req, res) => {
    try {
        const reports = await reportService.getAllReports();
        res.status(200).json({ data: reports });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

#### Step 4: Create Service
**File:** `services/reports/report.service.js`
```javascript
exports.getAllReports = async () => {
    return await Report.find();
};
```

#### Step 5: Create Model
**File:** `models/report.model.js`
```javascript
const reportSchema = new Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
```

#### Step 6: Create Middleware (if needed)
**File:** `middlewares/reports/validate-report.middleware.js`
```javascript
exports.validateReport = (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    next();
};
```

---

## 🎯 Key Concepts

### Module Aliases
```javascript
// Use @alias instead of relative paths
require('@models/admin.model');      // instead of ../../../models/admin.model
require('@services/admin');           // instead of ../../../services/admin
```

### Error Handling
```javascript
throw {
    statusCode: 400,
    message: 'Invalid input',
    code: 'INVALID_INPUT'
};
```

### Rate Limiting
```javascript
// Applied at route level
router.post('/create', createRateLimiter, controller.create);
```

### Authentication
```javascript
// Check JWT token and permissions
app.use(authTokenValidator);
app.use(rolePermissionValidator);
```

---

## 📚 Configuration Files Summary

| Config File | Purpose |
|------------|---------|
| `db.config.js` | MongoDB connection URL |
| `redis.config.js` | Redis connection settings |
| `server.config.js` | Server port and environment |
| `api-role-permission.config.js` | Role and permission mappings |
| `validation.config.js` | Input validation rules |
| `http-status.config.js` | HTTP status codes |
| `service-error.config.js` | Error message templates |
| `rate-limit.config.js` | Rate limit thresholds |

---

## 🔗 Dependencies Between Components

```
Routes
  ↓ (calls)
Controllers
  ↓ (calls)
Services
  ↓ (calls)
Models ← (uses) Configs
  ↓ (validates via)
Middlewares
  ↓ (formats response via)
Responses
```

---

## 📝 Coding Conventions

1. **File Naming:** Use kebab-case (e.g., `admin.controller.js`)
2. **Functions:** Use camelCase (e.g., `createAdmin()`)
3. **Constants:** Use UPPER_SNAKE_CASE
4. **Classes:** Use PascalCase
5. **Error Handling:** Always use try-catch in async functions
6. **Imports:** Group by type (external, internal, configs)

---

## 🚀 Quick Start for Developers

1. **Understand the routes:** Look at `routes/index.js`
2. **Find the controller:** Check `controllers/` for the handler
3. **Find the logic:** Check `services/` for business logic
4. **Find the schema:** Check `models/` for data structure
5. **Add validation:** Update relevant `middlewares/`
6. **Test with Postman:** Use the collection in `/postman`

---

**Last Updated:** May 2026  
**Maintainer:** Development Team
