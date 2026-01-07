# 🚀 Quick Database Initialization Guide

## You Already Have Everything You Need!

Your project has `init_railway_db.js` ready to go. Just follow these 3 simple steps:

---

## Step 1: Get Public Database URL from Railway

1. **In Railway**, click on your **Postgres** service
2. **Click the "Connect" button** (purple button, top right)
3. **Copy the connection string** that looks like:
   ```
   postgresql://postgres:BKMeiajpTMXXVIBNvRFXKXfrElEziMoX@xxxxx.railway.app:5432/railway
   ```
   
   > **Important**: The host should be something like `containers-us-west-xxx.railway.app` or similar, **NOT** `postgres.railway.internal`

---

## Step 2: Set Environment Variable

### Option A: Create Temporary .env File (Easiest)

Create `server/.env` with this content:

```env
RAILWAY_DATABASE_URL=postgresql://postgres:BKMeiajpTMXXVIBNvRFXKXfrElEziMoX@[YOUR-PUBLIC-HOST]:5432/railway
```

Replace `[YOUR-PUBLIC-HOST]` with the actual host from Step 1.

### Option B: Set Environment Variable in Terminal

**Windows PowerShell:**
```powershell
$env:RAILWAY_DATABASE_URL="postgresql://postgres:BKMeiajpTMXXVIBNvRFXKXfrElEziMoX@[YOUR-PUBLIC-HOST]:5432/railway"
```

---

## Step 3: Run the Initialization Script

```bash
cd server
node init_railway_db.js
```

### Expected Output:

```
Connecting to Railway PostgreSQL...
✅ Connected successfully!
Executing schema...
✅ Database schema created successfully!

📊 Created tables:
  - material_categories
  - material_listings
  - materials
  - transactions
  - users

Disconnected from database.
```

---

## ✅ Verify It Worked

### In Railway:

1. Go to **Postgres** service → **Database** tab → **Data** sub-tab
2. You should now see your tables listed!
3. Click on `material_categories` to see the sample data

---

## 🆘 Troubleshooting

### Error: "Connection refused" or "Timeout"

**Problem**: Using internal host instead of public host

**Solution**: Make sure you're using the PUBLIC database URL from Railway's "Connect" button, not the internal one.

### Error: "Cannot find module 'pg'"

**Problem**: Missing dependencies

**Solution**:
```bash
cd server
npm install
```

### Error: "SSL required"

**Problem**: Railway requires SSL connections

**Solution**: The script already handles this! Make sure you're using the latest version of the script.

---

## 🎯 After Initialization

Once the database is initialized:

1. ✅ **Delete the temporary .env file** (if you created one)
2. ✅ **Continue with deployment**:
   - Add environment variables to Railway backend service
   - Deploy frontend to Vercel
   - Test your application

---

## 📞 Quick Reference

**Your Database Credentials:**
- User: `postgres`
- Password: `BKMeiajpTMXXVIBNvRFXKXfrElEziMoX`
- Database: `railway`
- Port: `5432`
- Host: Get from Railway "Connect" button

**Files:**
- Init script: `server/init_railway_db.js` ✅
- SQL schema: `server/railway_schema.sql` ✅

---

**Ready? Get that public URL and let's initialize your database!** 🚀
