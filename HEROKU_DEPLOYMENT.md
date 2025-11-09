# Heroku Deployment Guide

## Overview
This app consists of a **backend** (Express.js) and **frontend** (React + Vite). You have two deployment options:

### Option 1: Separate Apps (Recommended)
Deploy backend and frontend as separate Heroku apps.

### Option 2: Single App
Serve the frontend build from the backend (single Heroku app).

---

## Option 1: Separate Apps Deployment

### Backend Deployment

1. **Create Heroku App:**
   ```bash
   cd venv/mcdonair-app/backend
   heroku create your-app-name-backend
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set DATABASE_URL=your-neon-database-url
   heroku config:set AWS_ACCESS_KEY_ID=your-aws-key
   heroku config:set AWS_SECRET_ACCESS_KEY=your-aws-secret
   heroku config:set AWS_REGION=us-east-1
   heroku config:set AWS_S3_BUCKET_NAME=your-bucket-name
   heroku config:set CDN_URL=your-cdn-url
   heroku config:set CORS_ORIGIN=https://your-frontend-app.herokuapp.com
   heroku config:set FRONTEND_URL=https://your-frontend-app.herokuapp.com
   ```

3. **Deploy:**
   ```bash
   git subtree push --prefix venv/mcdonair-app/backend heroku main
   # OR if backend is in root:
   git push heroku main
   ```

### Frontend Deployment

1. **Create Heroku App:**
   ```bash
   cd venv/mcdonair-app
   heroku create your-app-name-frontend
   ```

2. **Set Buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set VITE_API_URL=https://your-backend-app.herokuapp.com
   ```

4. **Update package.json start script** (already done):
   ```json
   "start": "vite preview --port $PORT --host 0.0.0.0"
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## Option 2: Single App Deployment

### Setup Backend to Serve Frontend

1. **Update server.js** to serve static files:
   ```javascript
   // Add before error handling middleware
   if (process.env.NODE_ENV === 'production') {
     const path = require('path');
     app.use(express.static(path.join(__dirname, '../dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../dist/index.html'));
     });
   }
   ```

2. **Create Procfile** (already created):
   ```
   web: cd backend && node server.js
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   heroku config:set DATABASE_URL=your-neon-database-url
   heroku config:set AWS_ACCESS_KEY_ID=your-aws-key
   heroku config:set AWS_SECRET_ACCESS_KEY=your-aws-secret
   heroku config:set AWS_REGION=us-east-1
   heroku config:set AWS_S3_BUCKET_NAME=your-bucket-name
   heroku config:set CDN_URL=your-cdn-url
   heroku config:set NODE_ENV=production
   ```

4. **Build Frontend Before Deploy:**
   ```bash
   cd venv/mcdonair-app
   npm run build
   ```

5. **Deploy:**
   ```bash
   git add dist/
   git commit -m "Add frontend build"
   git push heroku main
   ```

---

## Required Environment Variables

### Backend:
- `JWT_SECRET` - Secret key for JWT tokens
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_S3_BUCKET_NAME` - S3 bucket name
- `CDN_URL` - CDN URL for images
- `CORS_ORIGIN` - Frontend URL for CORS
- `FRONTEND_URL` - Frontend URL for password reset links
- `PORT` - Automatically set by Heroku

### Frontend (if separate):
- `VITE_API_URL` - Backend API URL

---

## Database Setup

1. **Add Neon Database Addon** (or use existing):
   ```bash
   heroku addons:create neon:free
   ```

2. **Run Migrations:**
   ```bash
   heroku run node -e "require('./database_schema.sql')"
   # Or manually run SQL from database_schema.sql
   ```

---

## Post-Deployment Checklist

- [ ] Test API endpoints
- [ ] Test user registration/login
- [ ] Test image uploads
- [ ] Verify CORS settings
- [ ] Check logs: `heroku logs --tail`
- [ ] Test password reset flow
- [ ] Verify environment variables are set

---

## Troubleshooting

### Backend won't start:
- Check logs: `heroku logs --tail`
- Verify all environment variables are set
- Check Procfile location

### Frontend can't connect to backend:
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend URL is accessible

### Database connection errors:
- Verify `DATABASE_URL` is correct
- Check database is accessible from Heroku
- Verify SSL is enabled if required

