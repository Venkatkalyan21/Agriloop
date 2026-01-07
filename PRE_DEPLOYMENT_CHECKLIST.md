# ✅ Pre-Deployment Checklist

## Before You Deploy - Verify Everything is Ready

### 📋 Code Preparation

- [x] **Database Schema Ready**
  - File: `server/railway_schema.sql` ✅
  - Contains all tables, indexes, and sample data

- [x] **Backend Configuration**
  - File: `server/package.json` ✅
  - Build script: `npm run build` ✅
  - Start script: `npm start` ✅
  - All dependencies listed ✅

- [x] **Frontend Configuration**
  - Directory: `client/` ✅
  - Vite configuration ready ✅
  - Build script configured ✅

- [x] **Railway Configuration**
  - File: `railway.json` ✅
  - Restart policy configured ✅

- [x] **Root Package Configuration**
  - File: `package.json` ✅
  - Monorepo scripts configured ✅

### 🔐 Accounts & Access

- [ ] **Railway Account**
  - Sign up at: https://railway.app
  - Connect GitHub account
  - Verify email

- [ ] **Vercel Account**
  - Sign up at: https://vercel.com
  - Connect GitHub account
  - Verify email

- [ ] **GitHub Repository**
  - Code pushed to: https://github.com/Venkatkalyan21/Agriloop
  - All changes committed
  - Repository is public or accessible to Railway/Vercel

### 🎯 Deployment Steps

#### Step 1: Railway Database (5 min)
- [ ] Create new Railway project
- [ ] Add PostgreSQL service
- [ ] Copy database credentials
- [ ] Open Query tab
- [ ] Paste `railway_schema.sql` content
- [ ] Execute SQL
- [ ] Verify tables created

#### Step 2: Railway Backend (10 min)
- [ ] Add new service to Railway project
- [ ] Connect to GitHub repository
- [ ] Configure environment variables:
  ```
  DB_USER=postgres
  DB_HOST=<from-railway>
  DB_NAME=railway
  DB_PASSWORD=<from-railway>
  DB_PORT=5432
  JWT_SECRET=<generate-random-32-chars>
  PORT=4000
  NODE_ENV=production
  FRONTEND_URL=<will-add-after-vercel>
  ```
- [ ] Verify build settings
- [ ] Wait for deployment
- [ ] Copy backend URL
- [ ] Test health endpoint: `https://your-app.up.railway.app/api/health`

#### Step 3: Vercel Frontend (5 min)
- [ ] Create new project on Vercel
- [ ] Import GitHub repository
- [ ] Set root directory to `client`
- [ ] Add environment variable:
  ```
  VITE_API_URL=<your-railway-backend-url>
  ```
- [ ] Deploy
- [ ] Copy frontend URL

#### Step 4: Final Configuration (5 min)
- [ ] Go back to Railway backend service
- [ ] Update `FRONTEND_URL` environment variable with Vercel URL
- [ ] Wait for Railway to redeploy
- [ ] Test full application

### 🧪 Testing

- [ ] **Backend Health Check**
  ```bash
  curl https://your-app.up.railway.app/api/health
  ```
  Expected: `{"status":"ok",...}`

- [ ] **Material Categories**
  ```bash
  curl https://your-app.up.railway.app/api/materials/categories
  ```
  Expected: Array of categories

- [ ] **Frontend Loads**
  - Visit: `https://your-app.vercel.app`
  - No console errors
  - Page displays correctly

- [ ] **User Registration**
  - Create new account
  - Verify success message
  - Check Railway database for new user

- [ ] **User Login**
  - Login with created account
  - Verify JWT token received
  - Dashboard accessible

- [ ] **Marketplace**
  - Browse listings
  - View listing details
  - Search functionality works

- [ ] **Create Listing** (if applicable)
  - Create new material listing
  - Verify it appears in marketplace
  - Check database for new entry

### 📊 Monitoring

- [ ] **Railway Logs**
  - No error messages
  - Server started successfully
  - Database connected

- [ ] **Vercel Logs**
  - Build completed successfully
  - No runtime errors
  - Functions working

- [ ] **Browser Console**
  - No CORS errors
  - No 404 errors
  - No authentication errors

### 🎉 Success Indicators

✅ All checks passed when:
- Backend health endpoint returns 200
- Frontend loads without errors
- User can register and login
- Marketplace displays data
- No CORS errors
- Data persists in database

### 📞 If Something Goes Wrong

**CORS Errors:**
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- No trailing slash in URLs

**Database Errors:**
- Verify PostgreSQL service is running
- Check database credentials
- Ensure schema was executed

**Build Errors:**
- Check Railway/Vercel logs
- Verify package.json scripts
- Ensure all dependencies are listed

**500 Errors:**
- Check Railway logs for stack traces
- Verify environment variables
- Test database connection

### 📚 Documentation Reference

- **Full Guide**: [DEPLOYMENT.md](file:///c:/Users/peddi/OneDrive/Desktop/nanda%20sir/Venu/Agriloop1/DEPLOYMENT.md)
- **Quick Reference**: [DEPLOYMENT_QUICK_REFERENCE.md](file:///c:/Users/peddi/OneDrive/Desktop/nanda%20sir/Venu/Agriloop1/DEPLOYMENT_QUICK_REFERENCE.md)
- **Verification Script**: `node check-deployment.js <backend-url>`

---

## 🚀 Ready to Deploy?

1. ✅ Complete all items in "Accounts & Access"
2. ✅ Follow "Deployment Steps" in order
3. ✅ Complete all "Testing" items
4. ✅ Verify "Success Indicators"
5. 🎉 Share your live application!

**Estimated Total Time: 25-30 minutes**

---

**Your URLs After Deployment:**
- Frontend: `https://agriloop.vercel.app` (or similar)
- Backend: `https://agriloop-production.up.railway.app` (or similar)

**Good luck! 🍀**
