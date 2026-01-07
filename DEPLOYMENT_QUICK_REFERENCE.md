# 🚀 Quick Deployment Reference

## Railway Backend Deployment - Quick Steps

### 1️⃣ Database Setup
```bash
# Copy this SQL file to Railway PostgreSQL Query tab
server/railway_schema.sql
```

### 2️⃣ Environment Variables (Railway)
```env
DB_USER=postgres
DB_HOST=<from-railway-postgres>
DB_NAME=railway
DB_PASSWORD=<from-railway-postgres>
DB_PORT=5432
JWT_SECRET=<generate-random-32-char-string>
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### 3️⃣ Build Configuration (Railway)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `/` (or leave empty)

---

## Vercel Frontend Deployment - Quick Steps

### 1️⃣ Build Configuration
- **Framework**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2️⃣ Environment Variables (Vercel)
```env
VITE_API_URL=https://your-app.up.railway.app
```

---

## 🔍 Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://your-app.up.railway.app/api/health

# Categories
curl https://your-app.up.railway.app/api/materials/categories
```

### Test Frontend
1. Visit: `https://your-app.vercel.app`
2. Register a new account
3. Login
4. Browse marketplace

---

## 📋 Deployment Checklist

**Railway (Backend + Database):**
- [ ] Create PostgreSQL service
- [ ] Run `railway_schema.sql` in Query tab
- [ ] Create backend service from GitHub
- [ ] Add all environment variables
- [ ] Verify build settings
- [ ] Wait for deployment
- [ ] Test API endpoints

**Vercel (Frontend):**
- [ ] Import GitHub repository
- [ ] Set root directory to `client`
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy
- [ ] Update Railway `FRONTEND_URL` with Vercel URL
- [ ] Test full application

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `FRONTEND_URL` in Railway to match Vercel URL |
| Database errors | Check Railway PostgreSQL is running and schema is initialized |
| 500 errors | Check Railway logs in Deployments tab |
| Build fails | Verify `package.json` scripts and dependencies |
| Frontend can't connect | Verify `VITE_API_URL` in Vercel settings |

---

## 📞 Important URLs

**Railway Dashboard**: https://railway.app/dashboard
**Vercel Dashboard**: https://vercel.com/dashboard
**GitHub Repo**: https://github.com/Venkatkalyan21/Agriloop

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Keep database credentials secure
- ✅ Use HTTPS for all connections
- ✅ Enable rate limiting (already configured)

---

**Last Updated**: January 2026
