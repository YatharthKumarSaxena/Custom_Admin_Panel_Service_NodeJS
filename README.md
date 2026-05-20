# 🛡️ Custom Admin Panel Service

A robust microservice for managing administrative functions, built with Express.js, MongoDB, and Redis. This service is designed to work seamlessly with other microservices like Custom Auth Service and Software Management Service.

**Author:** Yatharth Kumar Saxena  
**Version:** 1.0.0  
**License:** ISC

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup Guide](#setup-guide)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Custom Admin Panel Service is a microservice that provides administrative capabilities including:

- User and admin management
- Organization and organizational user management
- Device management
- Activity tracking and auditing
- Client conversion request handling
- Rate limiting and security features
- Microservice-to-microservice communication

---

## ✨ Features

- **🔐 Authentication & Authorization**: JWT-based token validation with microservice compatibility
- **📊 Activity Tracking**: Comprehensive audit logs and activity tracking
- **🚦 Rate Limiting**: Global and endpoint-specific rate limiting using Redis
- **🔄 Cron Jobs**: Scheduled tasks for maintenance and data processing
- **🎯 Role-Based Access**: Fine-grained permission management
- **📱 Device Management**: Track and manage user devices
- **🏢 Organization Management**: Multi-tenant support
- **⚡ Redis Caching**: Session management and performance optimization

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **MongoDB** | Primary database |
| **Mongoose** | MongoDB ODM |
| **Redis/IORedis** | Caching, sessions, rate limiting |
| **JWT** | Token-based authentication |
| **Axios** | HTTP client for microservices |
| **dotenv** | Environment configuration |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (v6.0 or higher)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Custom_Admin_Panel_Service
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (v5.2.1)
- mongoose (v9.2.3)
- ioredis (v5.10.0)
- jsonwebtoken (v9.0.3)
- express-rate-limit (v8.2.1)
- And other dependencies...

### Step 3: Verify Installation

```bash
npm list --depth=0
```

---

## 🔧 Setup Guide

### Step 1: Environment Configuration

1. **Create `.env` file** from the template:

```bash
cp .env.example .env
```

2. **Configure the following variables:**

```env
# 🍃 MongoDB Configuration
DB_NAME=admin_panel_service_db
DB_URL=mongodb://localhost/admin_panel_service_db

# 🔌 Server Configuration
PORT_NUMBER=8081
NODE_ENV=development

# 🔴 Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=                    # Leave blank if no authentication
REDIS_DB=0
REDIS_MAX_RETRY_ATTEMPTS=10
REDIS_RETRY_INITIAL_DELAY=100
REDIS_RETRY_MAX_DELAY=2000

# 🚦 Rate Limiting
RATE_LIMIT_WINDOW=10              # minutes
RATE_LIMIT_MAX=100                # requests per window

# 📧 Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Step 2: Ensure Services Are Running

Before starting the application, make sure these services are running:

#### **MongoDB**

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (with systemd)
sudo systemctl start mongod

# Windows
net start MongoDB

# Manual start
mongod
```

Verify MongoDB connection:
```bash
mongosh
> show dbs
```

#### **Redis**

```bash
# macOS (with Homebrew)
brew services start redis

# Linux (with systemd)
sudo systemctl start redis-server

# Manual start
redis-server

# Verify Redis connection
redis-cli ping
# Expected output: PONG
```

### Step 3: Database Setup (Optional)

If you need to seed initial data or set up collections:

```bash
# Check the bootstrap directory for any initialization scripts
ls src/bootstrap/
```

---

## ▶️ Running the Application

### Development Mode

```bash
npm start
```

Expected output:
```
✅ Connection established with MongoDB Successfully
⚠️ Microservice init failed (if microservice not fully configured)
🚀 Server running on port 8081
✅ Cron Jobs Initialized
```

### Verify Server is Running

```bash
# In another terminal
curl http://localhost:8081

# Or check health
curl http://localhost:8081/health
```

### Testing with Postman

1. Open the included Postman collection:
   ```
   postman/Custom Admin Panel Service.postman_collection.json
   ```

2. Import it into Postman to test all available endpoints

---

## 📁 Project Structure

```
Custom_Admin_Panel_Service/
├── server.js                          # Entry point - initializes server & DB
├── package.json                       # Dependencies & scripts
├── .env.example                       # Environment template
├── jsconfig.json                      # JavaScript path aliases
├── postman/                           # API collection for testing
│   └── Custom Admin Panel Service.postman_collection.json
├── src/
│   ├── app.js                         # Express app configuration
│   ├── routes/                        # API route definitions
│   ├── controllers/                   # Request handlers
│   ├── services/                      # Business logic
│   ├── models/                        # MongoDB schemas
│   ├── middlewares/                   # Custom middlewares
│   ├── configs/                       # Configuration files
│   ├── utils/                         # Helper utilities
│   ├── responses/                     # Response formatters
│   ├── rate-limiters/                 # Rate limiting rules
│   ├── cron-jobs/                     # Scheduled tasks
│   └── internals/                     # Microservice communication
└── testing/                           # Test utilities
```

For detailed navigation and component descriptions, see [src/README.md](src/README.md)

---

## 📡 API Documentation

### Base URL

```
http://localhost:8081
```

### Main Endpoints

| Module | Endpoint | Purpose |
|--------|----------|---------|
| **Admins** | `/api/admins` | Admin management |
| **Users** | `/api/users` | User management |
| **Organizations** | `/api/organizations` | Organization management |
| **Organization Users** | `/api/organization-users` | Org user relationships |
| **Devices** | `/api/devices` | Device management |
| **Activity Trackers** | `/api/activity-trackers` | Activity logging |
| **Client Conversion** | `/api/client-conversion-requests` | Conversion requests |
| **Internal** | `/api/internal` | Microservice routes |

For detailed API documentation, import the Postman collection.

---

## ⚙️ Configuration

### Module Aliases

The project uses module aliases for cleaner imports. See `package.json`:

```javascript
"@": "src"
"@routes": "src/routes"
"@controllers": "src/controllers"
"@models": "src/models"
"@services": "src/services"
// ... and more
```

**Usage:**
```javascript
// Instead of:
const { app } = require("../../../app");

// Use:
const { app } = require("@app");
```

### Rate Limiting

- **Global Rate Limiter**: Applied to all requests
- **Endpoint-Specific**: Different limits for different routes
- **Redis-Backed**: Distributed rate limiting across instances

See `src/rate-limiters/` for implementation details.

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
❌ MongoDB Connection Failed
```

**Solutions:**
1. Check MongoDB is running: `mongosh`
2. Verify `DB_URL` in `.env`
3. Check firewall settings
4. Ensure MongoDB service is started

### Redis Connection Issues

```
Error: Cannot connect to Redis
```

**Solutions:**
1. Check Redis is running: `redis-cli ping`
2. Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
3. Check Redis password if authentication is enabled
4. Restart Redis service

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::8081
```

**Solutions:**
```bash
# Find process using port 8081
lsof -i :8081          # macOS/Linux

# Kill the process
kill -9 <PID>

# Or use a different port
PORT_NUMBER=8082 npm start
```

### Module Not Found Errors

```
Cannot find module '@services/...'
```

**Solutions:**
1. Ensure `module-alias/register` is required first in `server.js` ✓ (already done)
2. Check `jsconfig.json` path mappings
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Microservice Init Failed

```
⚠️ Microservice init failed
```

**This is normal if:**
- Custom Auth Service or other microservices aren't running yet
- Check `src/services/bootstrap/microservice-init.service.js` for requirements

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Redis Documentation](https://redis.io/docs/)
- [JWT Documentation](https://jwt.io/)

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💼 Author

**Yatharth Kumar Saxena**

---

## 🤝 Contributing

For contributions, please follow the existing code structure and conventions found in the project.

---

**Last Updated:** May 2026  
**Status:** Active Development
