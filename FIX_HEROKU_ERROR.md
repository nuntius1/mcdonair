# Fix Heroku Application Error

## Step 1: Login to Heroku (if not already logged in)
```bash
heroku login
```

## Step 2: Check the Logs
```bash
heroku logs --tail --app mcdonair
```

**Look for these common errors:**
- `ERROR: DATABASE_URL environment variable is not set!` → Missing DATABASE_URL
- `Cannot find module` → Dependencies not installed
- `Connection refused` → Database connection issue
- `Error acquiring database client` → Database connection failed

## Step 3: Check Environment Variables
```bash
heroku config --app mcdonair
```

**Required variables:**
- ✅ `DATABASE_URL` - PostgreSQL connection string (CRITICAL!)
- ✅ `JWT_SECRET` - Secret key for JWT tokens
- ✅ `AWS_ACCESS_KEY_ID` - AWS S3 access key
- ✅ `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- ✅ `AWS_REGION` - AWS region (e.g., us-east-1)
- ✅ `AWS_S3_BUCKET_NAME` - S3 bucket name
- ✅ `CDN_URL` - CDN URL for images
- ✅ `CORS_ORIGIN` - Frontend URL
- ✅ `FRONTEND_URL` - Frontend URL for password reset

## Step 4: Set Missing Environment Variables

If any are missing, set them:

```bash
# Database URL (from Neon or your PostgreSQL provider)
heroku config:set DATABASE_URL="your-database-url" --app mcdonair

# JWT Secret
heroku config:set JWT_SECRET="your-secret-key" --app mcdonair

# AWS Credentials
heroku config:set AWS_ACCESS_KEY_ID="your-key" --app mcdonair
heroku config:set AWS_SECRET_ACCESS_KEY="your-secret" --app mcdonair
heroku config:set AWS_REGION="us-east-1" --app mcdonair
heroku config:set AWS_S3_BUCKET_NAME="mcdonair" --app mcdonair
heroku config:set CDN_URL="your-cdn-url" --app mcdonair

# CORS and Frontend URLs
heroku config:set CORS_ORIGIN="https://your-frontend-url.herokuapp.com" --app mcdonair
heroku config:set FRONTEND_URL="https://your-frontend-url.herokuapp.com" --app mcdonair
```

## Step 5: Restart the App
```bash
heroku restart --app mcdonair
```

## Step 6: Check Logs Again
```bash
heroku logs --tail --app mcdonair
```

## Step 7: Verify App is Running
```bash
heroku ps --app mcdonair
```

Should show: `web.1: up`

## Most Common Issues:

### Issue 1: Missing DATABASE_URL
**Error:** `ERROR: DATABASE_URL environment variable is not set!`
**Fix:** Set DATABASE_URL:
```bash
heroku config:set DATABASE_URL="your-neon-database-url" --app mcdonair
```

### Issue 2: Dependencies Not Installed
**Error:** `Cannot find module 'express'` or similar
**Fix:** The postinstall script should handle this. If not:
```bash
heroku run npm install --prefix backend --app mcdonair
```

### Issue 3: Database Connection Failed
**Error:** `Error acquiring database client`
**Fix:** 
- Check DATABASE_URL format
- Verify database allows connections from Heroku
- Check if SSL is required

### Issue 4: Port Already in Use
**Error:** `Port already in use`
**Fix:** Server should use `process.env.PORT` (already fixed ✅)

## Quick Test Commands:

```bash
# Check if app is running
heroku ps --app mcdonair

# View recent logs
heroku logs --tail --app mcdonair

# Check all config vars
heroku config --app mcdonair

# Restart app
heroku restart --app mcdonair

# Open app in browser
heroku open --app mcdonair
```

## After Fixing:

1. Commit and push the changes:
```bash
git add .
git commit -m "Fix Heroku deployment issues"
git push origin master
git push heroku master
```

2. Monitor logs:
```bash
heroku logs --tail --app mcdonair
```

## Need More Help?

Share the error message from `heroku logs --tail --app mcdonair` and I can help fix it!

