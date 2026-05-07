# Deployment instructions for Railway

## Option 1: Using Railway CLI (Recommended)

### Prerequisites
- Railway account (railway.app)
- GitHub repository connected
- Railway CLI installed

### Steps

1. **Create a Railway project**
   - Go to https://railway.app and sign up/login with GitHub
   - Create a new project

2. **Connect your GitHub repository**
   - Click "New Project" → "Deploy from GitHub"
   - Select your `team-task-manager` repository
   - Select both `Backend` and `frontend` directories (or deploy them separately)

3. **Add MySQL database**
   - In your Railway project, click "New" → "Database" → "MySQL"
   - Railway will automatically provide environment variables:
     - `DATABASE_URL`
     - `MYSQL_ROOT_PASSWORD`
     - `MYSQL_USER`
     - `MYSQL_PASSWORD`

4. **Set Environment Variables**
   - Go to your Railway project settings
   - Set these variables in "Variables":
     - `JWT_SECRET`: Your secure JWT secret key
     - `JWT_EXPIRATION_MS`: Token expiration time (default: 86400000)
     - `API_BASE_URL`: Backend URL (Railway will provide this after deployment)
     - `SPRING_DATASOURCE_URL`: MySQL connection URL (auto-provided by MySQL service)
     - `SPRING_DATASOURCE_USERNAME`: Database username
     - `SPRING_DATASOURCE_PASSWORD`: Database password

5. **Deploy**
   - Push changes to GitHub
   - Railway automatically builds and deploys on each push

## Option 2: Deploy Separately

You can deploy Backend and Frontend as separate Railway projects:

### Backend Service
```bash
cd Backend
railway init
railway up
```

### Frontend Service
```bash
cd frontend
railway init
railway up
```

Then configure the frontend to point to your backend URL.

## Environment Variables Setup

Create these in your Railway project dashboard:

```
JWT_SECRET=your-secret-key-here-min-32-characters
JWT_EXPIRATION_MS=86400000
SPRING_DATASOURCE_URL=mysql://user:pass@host:port/database
SPRING_DATASOURCE_USERNAME=railway
SPRING_DATASOURCE_PASSWORD=your-db-password
API_BASE_URL=https://your-backend-url.railway.app
```

## Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Railway account created (railway.app)
- [ ] Repository connected to Railway
- [ ] MySQL database service added
- [ ] Environment variables configured
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] MySQL connection verified
- [ ] Frontend can reach backend API

## Post-Deployment

1. Access your app at the Railway-provided URL
2. Test signup and login flows
3. Monitor logs in Railway dashboard
4. Set up auto-deploy (enabled by default with connected GitHub)

## Troubleshooting

- Check Railway logs: Railway Dashboard → Logs tab
- Verify environment variables are set correctly
- Ensure MySQL service is running
- Check CORS settings if frontend can't reach backend
