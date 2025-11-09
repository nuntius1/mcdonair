# Heroku Troubleshooting Guide

## Common Issues and Solutions

### Issue: Application Error on Heroku

#### 1. Check Logs
```bash
heroku logs --tail --app YOUR_APP_NAME
```

#### 2. Common Causes:

**A. Missing Environment Variables**
- Check all required env vars are set:
  ```bash
  heroku config --app YOUR_APP_NAME
  ```
- Required variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `AWS_S3_BUCKET_NAME`
  - `CDN_URL`
  - `CORS_ORIGIN`
  - `FRONTEND_URL`

**B. Dependencies Not Installed**
- The Procfile now includes `npm install` in backend folder
- If still failing, check if `backend/node_modules` exists

**C. Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Heroku IPs
- Verify SSL is enabled if required

**D. Port Issues**
- Heroku sets `PORT` automatically
- Server should use `process.env.PORT` (already done ✅)

**E. Missing Files**
- Ensure all required files are committed
- Check if `backend/server.js` exists
- Verify routes are in `backend/routes/`

#### 3. Quick Fixes:

**Fix 1: Rebuild with Clean Install**
```bash
heroku restart --app YOUR_APP_NAME
heroku logs --tail --app YOUR_APP_NAME
```

**Fix 2: Check Build Logs**
```bash
heroku logs --tail --app YOUR_APP_NAME | grep -i error
```

**Fix 3: Verify Procfile**
```bash
cat Procfile
# Should show: web: cd backend && npm install && node server.js
```

**Fix 4: Test Locally**
```bash
cd backend
npm install
node server.js
# Should start without errors
```

#### 4. Debugging Steps:

1. **Check if app is running:**
   ```bash
   heroku ps --app YOUR_APP_NAME
   ```

2. **Check recent deployments:**
   ```bash
   heroku releases --app YOUR_APP_NAME
   ```

3. **View detailed logs:**
   ```bash
   heroku logs --tail --app YOUR_APP_NAME
   ```

4. **Check environment variables:**
   ```bash
   heroku config --app YOUR_APP_NAME
   ```

5. **Test database connection:**
   ```bash
   heroku run node -e "const pg = require('pg'); const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()', (err, res) => {console.log(err || res.rows[0]); process.exit(0);});" --app YOUR_APP_NAME
   ```

## Most Likely Issues:

1. **Missing DATABASE_URL** - Most common cause
2. **Dependencies not installed** - Fixed with updated Procfile
3. **Missing JWT_SECRET** - Will cause auth to fail
4. **Database connection refused** - Check DATABASE_URL format

## Next Steps:

1. Get your Heroku app name
2. Run: `heroku logs --tail --app YOUR_APP_NAME`
3. Share the error message for specific help

