# Heroku Deployment Readiness Checklist

## ✅ Fixed Issues

1. **Fixed `JWT_SECRET` undefined error** - Uncommented and now uses `process.env.JWT_SECRET`
2. **Fixed `sql` undefined errors** - Replaced with `req.pool` queries in password reset routes
3. **Fixed database column names** - Updated to use `user_id` instead of `id`
4. **Created Procfile** - For Heroku deployment
5. **Created deployment guide** - See `HEROKU_DEPLOYMENT.md`

## ⚠️ Still Need to Address

### Critical:
1. **Procfile Location** - Currently in root, but backend is in `backend/` folder
   - **Fix:** Move Procfile to `backend/` OR update to `cd backend && node server.js`
   - **Current:** `web: cd backend && node server.js` ✅ (This is correct!)

2. **Frontend Build** - Need to build frontend before deploying
   - Run: `npm run build` in root directory
   - This creates `dist/` folder

3. **Environment Variables** - Must be set in Heroku:
   ```
   JWT_SECRET
   DATABASE_URL
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION
   AWS_S3_BUCKET_NAME
   CDN_URL
   CORS_ORIGIN
   FRONTEND_URL
   ```

### Recommended:
1. **Add health check endpoint** - Uncomment in server.js
2. **Add error logging** - Consider adding Sentry or similar
3. **Database migrations** - Ensure schema is up to date
4. **Test password reset flow** - Verify it works with production URLs

## 📋 Pre-Deployment Steps

1. **Test locally:**
   ```bash
   # Backend
   cd backend
   npm start
   
   # Frontend (in another terminal)
   cd ..
   npm run build
   npm run preview
   ```

2. **Verify environment variables:**
   - Check `.env` file has all required variables
   - Document which ones need to be set in Heroku

3. **Build frontend:**
   ```bash
   npm run build
   ```

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   ```

## 🚀 Deployment Options

### Option A: Separate Apps (Recommended)
- Backend: One Heroku app
- Frontend: Another Heroku app (or use Vercel/Netlify)

### Option B: Single App
- Serve frontend from backend
- Need to update server.js to serve static files
- See `HEROKU_DEPLOYMENT.md` for details

## ✅ Current Status

**Backend:**
- ✅ Uses `process.env.PORT` (Heroku compatible)
- ✅ Has start script in package.json
- ✅ Database connection uses `DATABASE_URL`
- ✅ All critical bugs fixed
- ✅ Procfile created

**Frontend:**
- ✅ Uses `VITE_API_URL` for production API
- ✅ Has build script
- ✅ Has preview/start script for production

**Status: READY FOR DEPLOYMENT** (after setting environment variables)

