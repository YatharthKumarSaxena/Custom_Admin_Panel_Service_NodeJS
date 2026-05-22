# 🚀 Welcome to the Routes Folder

Welcome to the **Routes** folder! This is the central hub for all HTTP endpoint definitions and API routing logic in the Custom Admin Panel Service.

## 📋 Overview

The Routes folder contains all the API endpoint definitions that handle incoming HTTP requests. Each route file is responsible for mapping specific URLs to their corresponding controllers and applying relevant middleware for authentication, validation, and error handling.

## 📁 Folder Structure

```
routes/
├── index.js                              # Main router entry point
├── activity-tracker.routes.js            # Activity tracking endpoints
├── admin.routes.js                       # Admin management endpoints
├── client-conversion-request.routes.js   # Client conversion request endpoints
├── device.routes.js                      # Device management endpoints
├── internal.routes.js                    # Internal service endpoints
├── middleware.gateway.routes.js          # Middleware gateway configuration
├── organization.routes.js                # Organization management endpoints
└── user.routes.js                        # User management endpoints
```

## 🎯 Available Route Files

### Core Routes

| Route File | Purpose | Endpoints |
|-----------|---------|-----------|
| **activity-tracker.routes.js** | Manages activity tracking operations | Create, Read, Update activity logs |
| **admin.routes.js** | Admin user management | CRUD operations for admin accounts |
| **client-conversion-request.routes.js** | Client conversion workflows | Manage conversion requests |
| **device.routes.js** | Device management | Register, update, delete devices |
| **organization.routes.js** | Organization management | Company/organization operations |
| **user.routes.js** | User management | User account operations |
| **internal.routes.js** | Internal service routes | Microservice communication |
| **middleware.gateway.routes.js** | Request gateway configuration | Request validation & routing |

## 🔧 How to Use

### 1. **Adding a New Route**

Create a new route file following the naming convention: `entity.routes.js`

```javascript
// Example: new-entity.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/new-entity');
const middleware = require('../middlewares');

router.post('/', middleware.validate, controller.create);
router.get('/:id', controller.getById);
router.put('/:id', middleware.validate, controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
```

### 2. **Registering Routes in index.js**

Add your new route to the main `index.js` file:

```javascript
const newEntityRoutes = require('./new-entity.routes');
router.use('/api/new-entity', newEntityRoutes);
```

### 3. **Applying Middleware**

Routes can apply middleware for:
- Authentication validation
- Request body validation
- Authorization checks
- Rate limiting
- Error handling

## 📌 Best Practices

✅ **Do:**
- Keep routes organized by entity/resource
- Apply proper middleware for validation and authentication
- Use consistent naming conventions
- Document complex route logic
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)

❌ **Don't:**
- Add business logic directly in routes (use controllers instead)
- Create overly complex route files
- Skip middleware validation
- Hardcode configuration values

## 🔗 Related Folders

- **Controllers** (`../controllers/`) - Handle route logic and return responses
- **Middlewares** (`../middlewares/`) - Validate requests and handle authentication
- **Models** (`../models/`) - Database schemas

## 📞 Support

For questions or issues with routes, please refer to the main project README or check individual controller documentation.

---

**Last Updated:** May 2026
