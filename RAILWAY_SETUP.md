# Railway Deployment Guide

## Step 1: Connect GitHub Repository

1. Go to https://railway.app
2. Login with GitHub
3. Create a **New Project**
4. Select **"Deploy from GitHub repo"**
5. Choose your **team-task-manager** repository
6. Railway auto-detects the structure

## Step 2: Add Services

Railway will detect your services. If not, add them manually:

### Backend Service
- **Service name**: `backend`
- **Root**: `Backend/`
- **Dockerfile**: Uses the provided Dockerfile
- **Port**: 8080

### Frontend Service  
- **Service name**: `frontend`
- **Root**: `frontend/`
- **Dockerfile**: Uses the provided Dockerfile
- **Port**: 3000

### MySQL Database
- Click **New** → **Database** → **MySQL**
- Railway creates `MYSQL_*` variables automatically

## Step 3: Environment Variables Setup

In Railway Project Settings → Variables, set these:

### For Backend Service

```
# Database Connection (Railway MySQL auto-provides these)
SPRING_DATASOURCE_URL=mysql://your_user:your_password@sql.railway.internal:3306/railway

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-chars-long-!!!
JWT_EXPIRATION_MS=86400000

# Server Port
PORT=8080

# Optional: Connection Pool
DB_POOL_SIZE=10
```

### For Frontend Service

```
# Backend API URL (set AFTER backend deploys)
REACT_APP_API_BASE=https://your-backend-railway-url/api
```

## Step 4: Connect MySQL to Backend

1. In Railway Dashboard, go to your MySQL service
2. Click **Connect** button
3. Copy the **MYSQL_URL** or individual credentials
4. Paste into Backend environment variables

### Option A: Using MYSQL_URL (Recommended)
```
SPRING_DATASOURCE_URL=${{MYSQL.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{MYSQL.MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}
```

### Option B: Manual URL
```
SPRING_DATASOURCE_URL=mysql://user:password@host:3306/database
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
```

## Step 5: Deploy and Test

1. **Push to GitHub** (if not auto-detected):
   ```powershell
   git push origin master
   ```

2. **Railway auto-deploys** on every push

3. **Get service URLs** from Railway Dashboard:
   - Backend URL: `https://your-backend-xxx.railway.app`
   - Frontend URL: `https://your-frontend-xxx.railway.app`

4. **Update Frontend Variables**:
   - Go to frontend service settings
   - Set `REACT_APP_API_BASE=https://your-backend-xxx.railway.app/api`
   - Trigger rebuild

## Step 6: Verify Deployment

1. Open Frontend URL in browser
2. Sign up with test email
3. Login
4. Create a project
5. Create tasks
6. View dashboard

## Troubleshooting

### Backend fails to start
```powershell
# Check logs in Railway Dashboard
# Common issues:
# 1. JWT_SECRET not set (too short)
# 2. Database connection string invalid
# 3. Port conflict (should be 8080)
```

### Frontend can't reach backend
```javascript
// Check frontend logs
// Set REACT_APP_API_BASE to full backend URL
// Example: https://backend-abc123.railway.app/api
```

### MySQL connection error
```
# Check MySQL service status
# Verify SPRING_DATASOURCE_URL matches railway.internal format
# Example: mysql://root:password@sql.railway.internal:3306/railway
```

### Database tables not created
```
# Check that spring.jpa.hibernate.ddl-auto=update is set
# Check backend logs for Hibernate initialization
```

## Quick Reference: Variable Templates

Copy these into Railway Variables:

**Backend**
```
SPRING_DATASOURCE_URL=mysql://{{MYSQL_USER}}:{{MYSQL_PASSWORD}}@sql.railway.internal:3306/railway
SPRING_DATASOURCE_USERNAME=${{MYSQL.MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MYSQL.MYSQL_PASSWORD}}
JWT_SECRET=YourSecureJWTSecretKeyMinimum32CharactersLongForProduction!@#
JWT_EXPIRATION_MS=86400000
PORT=8080
DB_POOL_SIZE=10
```

**Frontend**
```
REACT_APP_API_BASE=https://your-backend-service.railway.app/api
```

## Architecture Overview

```
GitHub Push
    ↓
Railway Auto-Deploy
    ├── Maven Build Backend → Java 17 Container
    ├── npm Build Frontend → Node 18 Container
    └── MySQL Database Service
        ↓
Frontend Service (Port 3000)
    ├── Serves React UI
    └── Calls Backend API via REACT_APP_API_BASE
        ↓
Backend Service (Port 8080)
    ├── Handles Auth, Projects, Tasks
    └── Connects to MySQL via SPRING_DATASOURCE_URL
```

## After Deployment

1. ✅ Users can sign up and login
2. ✅ Create projects and manage members
3. ✅ Create, assign, and update tasks
4. ✅ View dashboard with task statistics
5. ✅ JWT tokens secure the API

Your app is now live on Railway! 🚀
