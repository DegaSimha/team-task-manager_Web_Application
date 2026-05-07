# Team Task Manager - Railway Deployment Complete Guide

## ✅ What's Been Set Up

Your app is now fully configured for Railway deployment with:
- ✅ CORS enabled for frontend-backend communication
- ✅ MySQL connection pooling optimized
- ✅ JWT authentication configured
- ✅ Docker containers ready for both backend and frontend
- ✅ Environment variables properly configured

## 🚀 Quick Deploy to Your Railway Project

### Step 1: Push Code to GitHub
```powershell
cd c:\Users\simha\team-task-manager
git push origin master
```

### Step 2: Connect to Your Railway Project

Your Railway Project URL: 
```
https://railway.app/project/b6f98cba-ffea-4751-8c64-015b594d25a7
```

Go to: **https://railway.app/project/b6f98cba-ffea-4751-8c64-015b594d25a7**

### Step 3: Add Services to Railway

1. Click **"New"** → **"GitHub Repo"**
2. Select your **team-task-manager** repository
3. Choose the root directory (it will auto-detect sub-services)

OR deploy separately:

#### Backend Service
1. Click **"New"** → **"GitHub Repo"**
2. Select repository → Choose **Backend** directory
3. Railway will use the Dockerfile automatically

#### Frontend Service
1. Click **"New"** → **"GitHub Repo"**
2. Select repository → Choose **frontend** directory
3. Railway will use the Dockerfile automatically

#### MySQL Database
1. Click **"New"** → **"Database"** → **"MySQL"**
2. Railway creates the database automatically

### Step 4: Set Environment Variables

After services are created, configure variables:

#### Backend Service Variables
1. Go to Railway Dashboard → Backend Service
2. Click **"Variables"** tab
3. Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `SPRING_DATASOURCE_URL` | `mysql://root:password@sql.railway.internal:3306/railway` | Get password from MySQL service |
| `SPRING_DATASOURCE_USERNAME` | `root` | Default MySQL user |
| `SPRING_DATASOURCE_PASSWORD` | `your_mysql_password` | From MySQL service details |
| `JWT_SECRET` | `MySecureJWTSecretKey32CharactersMinimumForProduction!@#` | Must be 32+ characters |
| `JWT_EXPIRATION_MS` | `86400000` | 24 hours in milliseconds |
| `PORT` | `8080` | Default port |

4. Click **"Deploy"** button

#### Frontend Service Variables
1. Go to Railway Dashboard → Frontend Service
2. Click **"Variables"** tab
3. Add this variable:

| Key | Value | Notes |
|-----|-------|-------|
| `REACT_APP_API_BASE` | `https://backend-xxxxx.railway.app/api` | Replace with your backend URL after it deploys |

4. Click **"Deploy"** button

### Step 5: Get Service URLs

After deployment:
1. Backend Service → **"Settings"** → Copy **Public URL**
2. Frontend Service → **"Settings"** → Copy **Public URL**

Example URLs:
```
Backend:  https://backend-team-task-manager-prod.railway.app
Frontend: https://frontend-team-task-manager-prod.railway.app
```

### Step 6: Update Frontend with Backend URL

1. Go to Frontend Service → **"Variables"**
2. Set `REACT_APP_API_BASE` to your backend URL with `/api` suffix
3. Example: `https://backend-team-task-manager-prod.railway.app/api`
4. Click **"Deploy"**

### Step 7: Test Your App

1. Open Frontend URL in browser: `https://frontend-xxx.railway.app`
2. Sign up with test email
3. Login
4. Create a project
5. Add members and create tasks
6. Check dashboard statistics

## 🔑 How to Get MySQL Credentials

1. Go to Railway Dashboard
2. Click on **MySQL Service**
3. Click **"Connect"** button
4. You'll see credentials:
   - **Host**: `sql.railway.internal`
   - **Port**: `3306`
   - **Database**: `railway`
   - **User**: `root`
   - **Password**: (copy from here)

Build the connection string:
```
mysql://root:YOUR_PASSWORD@sql.railway.internal:3306/railway
```

## 📊 Service Architecture

```
┌─────────────────────────────────┐
│   GitHub Repository             │
│  (team-task-manager)            │
└──────────────┬──────────────────┘
               │
        Railway Auto-Deploy
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
 Backend    Frontend   MySQL DB
 (Java 17)  (React18)  (Auto-created)
    │          │          │
    └──────────┼──────────┘
               │
        Public URLs
```

## 🔐 Security Notes

- JWT_SECRET should be changed from the example
- Use minimum 32 characters for JWT_SECRET
- CORS is enabled for all origins (can be restricted later)
- HTTPS is automatic with Railway
- Database password is secure (Railway managed)

## 🐛 Troubleshooting

### Backend Service Fails
**Check logs**: Railway → Backend Service → Logs
- Verify JWT_SECRET is set (min 32 chars)
- Verify SPRING_DATASOURCE_URL is correct
- Check MySQL service is running

### Frontend Can't Reach Backend
**Check logs**: Railway → Frontend Service → Logs
- Verify REACT_APP_API_BASE is set correctly
- Include `/api` suffix in URL
- Check backend is deployed and responding

### Database Won't Connect
**Check logs**: Railway → Backend Service → Logs
- Verify MySQL service is running
- Check password matches SPRING_DATASOURCE_PASSWORD
- Verify host is `sql.railway.internal`

### Auto-Deploy Not Working
- Ensure GitHub repo is connected
- Check that changes are pushed to master branch
- Railway watches for commits and auto-deploys

## 📝 Environment Variable Reference

### Backend (Spring Boot)
```properties
# Database
SPRING_DATASOURCE_URL=mysql://user:pass@host:port/db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET=min32characterslong!!!
JWT_EXPIRATION_MS=86400000

# Server
PORT=8080
DB_POOL_SIZE=10
```

### Frontend (React)
```javascript
REACT_APP_API_BASE=https://backend-url/api
```

## ✨ What's Working

After deployment you can:
- ✅ Sign up new users
- ✅ Login with email/password
- ✅ Create projects
- ✅ Add team members to projects
- ✅ Create and assign tasks
- ✅ Update task status (TODO → IN_PROGRESS → DONE)
- ✅ View task dashboard with statistics
- ✅ Admin dashboard for all tasks
- ✅ Task priority and due dates
- ✅ JWT token authentication

## 🎯 Next Steps

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add MySQL database
4. Set environment variables
5. Deploy services
6. Test the application
7. Share URL with your team!

---

**Questions?** Check Railway docs: https://docs.railway.app

**Your Project**: https://railway.app/project/b6f98cba-ffea-4751-8c64-015b594d25a7
