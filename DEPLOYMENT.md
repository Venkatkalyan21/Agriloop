# 🚀 AgriLoop Deployment Guide - Vercel + Railway

Complete guide to deploy your Circular Economy Marketplace to production.

## 📋 Prerequisites

- ✅ GitHub repository: https://github.com/Venkatkalyan21/Agriloop
- ✅ Vercel account (Sign up at https://vercel.com)
- ✅ Railway account (Sign up at https://railway.app)

---

## 🎯 Deployment Architecture

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express)
- **Database**: Railway PostgreSQL

---

## 📦 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **`Venkatkalyan21/Agriloop`**
5. Railway will detect your project

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a database and provide a `DATABASE_URL`

### Step 3: Configure Backend Service

1. Click on your backend service
2. Go to **"Settings"** → **"Root Directory"**
3. Set to: `server`
4. Go to **"Variables"** tab
5. Add these environment variables:

```
NODE_ENV=production
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_change_this
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=https://your-app.vercel.app
```

**Note**: Replace `your-app.vercel.app` with your actual Vercel URL (you'll get this in Part 2)

### Step 4: Deploy Backend

1. Railway will auto-deploy
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://agriloop-production.up.railway.app`)

### Step 5: Initialize Database

1. In Railway, click on your **PostgreSQL** service
2. Go to **"Data"** tab
3. Click **"Query"**
4. Copy and paste the contents of `server/src/database/schema.sql`
5. Execute the query
6. Then run the seed script (optional - for sample data)

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to https://vercel.com and sign in
2. Click **"Add New"** → **"Project"**
3. Import **`Venkatkalyan21/Agriloop`**
4. Vercel will detect it's a Vite project

### Step 2: Configure Build Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 3: Add Environment Variables

1. Go to **"Environment Variables"**
2. Add:

```
VITE_API_URL=https://your-railway-backend-url.up.railway.app
```

**Replace** with your actual Railway backend URL from Part 1, Step 4

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://agriloop.vercel.app`)

---

## 🔄 Part 3: Update Backend CORS

1. Go back to **Railway**
2. Click on your backend service
3. Go to **"Variables"**
4. Update `CORS_ORIGIN` to your Vercel URL:

```
CORS_ORIGIN=https://agriloop.vercel.app
```

5. Save and redeploy

---

## ✅ Part 4: Verification

### Test Your Deployment

1. Visit your Vercel URL: `https://agriloop.vercel.app`
2. Navigate to **Marketplace**
3. You should see listings (if you seeded the database)
4. Try registering a new user
5. Test creating a listing

### Troubleshooting

**If marketplace is empty:**
- Run the seed script in Railway PostgreSQL Query tab
- Use the SQL from `server/add_more_listings.sql`

**If you get CORS errors:**
- Check `CORS_ORIGIN` in Railway matches your Vercel URL
- Redeploy backend after changing

**If backend won't start:**
- Check Railway logs
- Verify `DATABASE_URL` is set correctly
- Ensure `PORT` is set to `4000`

---

## 🎉 Success!

Your AgriLoop marketplace is now live at:
- **Frontend**: https://agriloop.vercel.app
- **Backend**: https://agriloop-production.up.railway.app

---

## 📝 Important Notes

1. **Free Tier Limits:**
   - Railway: $5 free credit/month
   - Vercel: Unlimited for personal projects

2. **Custom Domain** (Optional):
   - Add custom domain in Vercel settings
   - Update CORS_ORIGIN in Railway

3. **Environment Variables:**
   - Never commit `.env` files
   - Use Railway/Vercel dashboards for secrets

4. **Database Backups:**
   - Railway provides automatic backups
   - Download backups from Railway dashboard

---

## 🔧 Quick Commands

**Redeploy Frontend:**
```bash
git push origin main
# Vercel auto-deploys
```

**Redeploy Backend:**
```bash
git push origin main
# Railway auto-deploys
```

**View Logs:**
- Railway: Click service → "Deployments" → "View Logs"
- Vercel: Click deployment → "Logs"

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Your GitHub: https://github.com/Venkatkalyan21/Agriloop
