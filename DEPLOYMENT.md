# 🚀 AgriLoop Deployment Guide

This guide will walk you through deploying the AgriLoop application to production using Railway for the backend and database, and Vercel for the frontend.

## 📋 Prerequisites

Before you begin, make sure you have:

- [x] GitHub account
- [x] Railway account (sign up at [railway.app](https://railway.app))
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] Git installed locally
- [x] Your code pushed to GitHub

## 🗄️ Part 1: Deploy Database & Backend to Railway

### Step 1: Create a New Railway Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy PostgreSQL"**
4. Railway will create a PostgreSQL database instance

### Step 2: Get Database Connection Details

1. Click on your PostgreSQL service
2. Go to the **"Variables"** tab
3. Note down these connection details:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `DATABASE_URL` (complete connection string)

### Step 3: Initialize Database Schema

You have two options to initialize your database:

#### Option A: Using Railway's PostgreSQL Query Tab

1. In Railway, click on your PostgreSQL service
2. Go to the **"Query"** tab
3. Copy the entire contents of `server/railway_schema.sql`
4. Paste it into the query editor
5. Click **"Run Query"**
6. Verify the tables were created successfully

#### Option B: Using a Local PostgreSQL Client

1. Install `psql` or use a GUI tool like pgAdmin or DBeaver
2. Connect using the `DATABASE_URL` from Railway
3. Run the schema file:
   ```bash
   psql "postgresql://user:password@host:port/database" -f server/railway_schema.sql
   ```

### Step 4: Deploy Backend to Railway

1. In your Railway project, click **"New Service"**
2. Select **"GitHub Repo"**
3. Authorize Railway to access your GitHub account
4. Select your **Agriloop** repository
5. Railway will detect it as a Node.js project

### Step 5: Configure Backend Environment Variables

1. Click on your backend service
2. Go to the **"Variables"** tab
3. Add the following environment variables:

```env
# Database Configuration (use values from your PostgreSQL service)
DB_USER=postgres
DB_HOST=<your-railway-postgres-host>
DB_NAME=railway
DB_PASSWORD=<your-railway-postgres-password>
DB_PORT=5432

# Or use the complete DATABASE_URL
DATABASE_URL=<your-railway-database-url>

# JWT Secret (generate a strong random string)
JWT_SECRET=<generate-a-secure-random-string>

# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration (will add frontend URL later)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**To generate a secure JWT_SECRET:**
```bash
# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use an online generator
# Visit: https://randomkeygen.com/
```

### Step 6: Configure Build Settings

Railway should auto-detect your build settings from `package.json`. Verify:

1. **Root Directory**: Leave empty (or set to `/` if needed)
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`

If Railway doesn't auto-detect, you can set these in the **"Settings"** tab.

### Step 7: Deploy Backend

1. Railway will automatically deploy after you configure the variables
2. Wait for the deployment to complete (check the **"Deployments"** tab)
3. Once deployed, click on your service to get the public URL
4. Your backend will be available at: `https://your-app-name.up.railway.app`

### Step 8: Test Backend Deployment

Test your backend API:

```bash
# Health check
curl https://your-app-name.up.railway.app/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Deployment

1. Update the API URL in your frontend code
2. Open `client/src/config.ts` (or wherever your API URL is configured)
3. Update to use your Railway backend URL:

```typescript
export const API_URL = process.env.VITE_API_URL || 'https://your-app-name.up.railway.app';
```

### Step 2: Push Changes to GitHub

```bash
git add .
git commit -m "Configure production API URL"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it as a Vite project

### Step 4: Configure Build Settings

Vercel should auto-detect these settings:

- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 5: Add Environment Variables

In Vercel project settings, add:

```env
VITE_API_URL=https://your-app-name.up.railway.app
```

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your frontend will be available at: `https://your-project.vercel.app`

### Step 7: Update Backend CORS Configuration

1. Go back to Railway
2. Update the `FRONTEND_URL` environment variable with your Vercel URL:
   ```env
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Railway will automatically redeploy with the new configuration

## ✅ Part 3: Verification

### Test the Complete Application

1. **Visit your frontend**: `https://your-project.vercel.app`
2. **Test user registration**:
   - Create a new account
   - Verify you can log in
3. **Test marketplace features**:
   - Browse material listings
   - Create a new listing (if logged in as a company)
   - View listing details
4. **Check database**:
   - Go to Railway PostgreSQL service
   - Use the Query tab to verify data is being stored

### Common Issues & Solutions

#### Issue: CORS Errors

**Solution**: Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly (no trailing slash)

#### Issue: Database Connection Errors

**Solution**: 
- Verify all database environment variables are correct
- Check that the PostgreSQL service is running in Railway
- Ensure the schema was initialized properly

#### Issue: 500 Internal Server Error

**Solution**:
- Check Railway logs: Click on your service → "Deployments" → Click on latest deployment → "View Logs"
- Look for error messages and stack traces

#### Issue: Frontend Can't Connect to Backend

**Solution**:
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the Railway backend is deployed and accessible
- Test the backend URL directly in your browser

## 🔧 Maintenance & Updates

### Updating the Backend

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Railway will automatically redeploy

### Updating the Frontend

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically redeploy

### Database Migrations

When you need to update the database schema:

1. Create a migration SQL file
2. Connect to Railway PostgreSQL using the Query tab
3. Run your migration SQL
4. Or use a migration tool like `node-pg-migrate`

## 📊 Monitoring

### Railway Monitoring

- **Logs**: View real-time logs in the Deployments tab
- **Metrics**: Check CPU, memory, and network usage
- **Database**: Monitor database size and connections

### Vercel Monitoring

- **Analytics**: View page views and performance
- **Logs**: Check function logs for errors
- **Performance**: Monitor Core Web Vitals

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files to Git
2. **JWT Secret**: Use a strong, random secret (at least 32 characters)
3. **Database**: Use Railway's private networking when possible
4. **HTTPS**: Both Railway and Vercel provide HTTPS by default
5. **Rate Limiting**: Your backend already has rate limiting configured

## 💰 Cost Considerations

### Railway
- **Free Tier**: $5 of usage per month
- **PostgreSQL**: ~$5-10/month depending on usage
- **Backend**: ~$5-10/month depending on traffic

### Vercel
- **Free Tier**: Generous limits for personal projects
- **Bandwidth**: 100GB/month on free tier
- **Builds**: Unlimited for personal projects

## 📞 Support

If you encounter issues:

1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Review this deployment guide
4. Check the Railway and Vercel documentation

## 🎉 Success!

Your AgriLoop application is now live! Share your URLs:

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-app-name.up.railway.app`

---

**Deployment Checklist:**

- [ ] PostgreSQL database created on Railway
- [ ] Database schema initialized
- [ ] Backend deployed to Railway
- [ ] Backend environment variables configured
- [ ] Backend API tested and working
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] CORS configured correctly
- [ ] Full application tested end-to-end
- [ ] URLs documented and shared

**Made with 💚 for a sustainable future**
