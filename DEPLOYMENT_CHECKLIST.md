# 🚀 Deployment Checklist - AgriLoop

Follow these steps to deploy your application to production.

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: https://github.com/Venkatkalyan21/Agriloop
- [x] README.md updated
- [x] DEPLOYMENT.md guide created
- [ ] Vercel account created
- [ ] Railway account created

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend to Railway (15 minutes)

#### Step 1.1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repositories

#### Step 1.2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `Venkatkalyan21/Agriloop`
4. Railway will start deploying

#### Step 1.3: Configure Backend Service
1. Click on your service (should auto-detect Node.js)
2. Go to **Settings** tab
3. Under "Root Directory", set: `server`
4. Under "Start Command", verify it's: `npm start` or `npm run dev`

#### Step 1.4: Add PostgreSQL Database
1. In your project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway creates database automatically
4. Copy the `DATABASE_URL` (you'll need this)

#### Step 1.5: Set Environment Variables
1. Click on your backend service
2. Go to "Variables" tab
3. Add these variables:

```
NODE_ENV=production
PORT=4000
JWT_SECRET=your_super_secret_jwt_key_12345
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=https://agriloop.vercel.app
```

**Note:** We'll update `CORS_ORIGIN` after deploying frontend

#### Step 1.6: Deploy Backend
1. Railway will auto-deploy
2. Wait 2-3 minutes
3. Copy your backend URL (e.g., `https://agriloop-production.up.railway.app`)
4. Test it: Open `https://your-backend-url.up.railway.app/` in browser

#### Step 1.7: Initialize Database
1. Click on PostgreSQL service
2. Go to "Data" tab
3. Click "Query"
4. Copy contents of `server/src/database/schema.sql`
5. Paste and Execute
6. (Optional) Run seed script for sample data

---

### Part 2: Deploy Frontend to Vercel (10 minutes)

#### Step 2.1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

#### Step 2.2: Import Project
1. Click "Add New" → "Project"
2. Import `Venkatkalyan21/Agriloop`
3. Vercel will detect Vite

#### Step 2.3: Configure Build Settings
1. **Framework Preset:** Vite
2. **Root Directory:** `client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

#### Step 2.4: Add Environment Variable
1. Expand "Environment Variables"
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-backend-url.up.railway.app`
   
   (Use your actual Railway backend URL from Part 1, Step 1.6)

#### Step 2.5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your Vercel URL (e.g., `https://agriloop.vercel.app`)

---

### Part 3: Update CORS Settings (2 minutes)

#### Step 3.1: Update Backend CORS
1. Go back to Railway
2. Click on your backend service
3. Go to "Variables"
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://agriloop.vercel.app
   ```
5. Save (Railway will auto-redeploy)

---

### Part 4: Verification (5 minutes)

#### Test Your Deployment
1. ✅ Visit your Vercel URL
2. ✅ Navigate to "Marketplace"
3. ✅ Try registering a new user
4. ✅ Check if listings appear (if you seeded data)

#### Troubleshooting
- **Empty marketplace?** Run seed script in Railway PostgreSQL
- **CORS errors?** Verify `CORS_ORIGIN` matches Vercel URL exactly
- **Backend not responding?** Check Railway logs
- **Frontend errors?** Check Vercel deployment logs

---

## 🎉 Success!

Your AgriLoop is now live at:
- **Frontend:** https://agriloop.vercel.app
- **Backend:** https://agriloop-production.up.railway.app

---

## 📝 Important Notes

- Both services have **free tiers**
- Railway: $5 free credit/month
- Vercel: Unlimited for personal projects
- Auto-deploys on every `git push`

---

## 🔗 Quick Links

- GitHub: https://github.com/Venkatkalyan21/Agriloop
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
