# Procfile vs Heroku Auto-Detection

## Heroku Auto-Detection

**Yes, Heroku CAN auto-detect your process**, but only if:
1. You have a `start` script in your **root** `package.json`
2. Your app structure is simple (not a monorepo)

## Your Situation

You have a **monorepo structure**:
- **Root** `package.json` → Frontend (React + Vite)
  - `start` script: `vite preview` (frontend)
- **Backend** `package.json` → Backend (Express.js)
  - `start` script: `node server.js` (backend)

## The Problem

When Heroku auto-detects, it uses the **root** `package.json`'s `start` script, which runs the **frontend** instead of the **backend**.

That's why you saw in the logs:
```
> mcdonair-shawarma@1.0.0 start
> vite preview --port $PORT --host 0.0.0.0
```

## Solution: You NEED a Procfile

The Procfile **overrides** auto-detection and tells Heroku exactly what to run.

## Current Procfile (Correct)

```
web: cd backend && npm install && node server.js
```

This tells Heroku:
1. Run the `web` process type
2. Change to `backend` directory
3. Install dependencies
4. Run `node server.js`

## Alternative Options

### Option 1: Keep Procfile (Recommended)
✅ Current setup - works for monorepo

### Option 2: Change Root package.json start script
Change root `package.json`:
```json
"start": "cd backend && node server.js"
```
❌ But then you can't run frontend locally easily

### Option 3: Use Heroku Buildpacks
More complex, but can handle monorepos better

## Why Your Procfile Should Work

The Procfile is correct, but Heroku might not be using it if:
1. Procfile is in wrong location (should be in root)
2. Procfile has wrong format
3. Heroku cache needs clearing

## Verify Procfile is Being Used

Check logs for:
- ✅ `Starting process with command 'cd backend && npm install && node server.js'`
- ❌ `Starting process with command 'npm start'` (means Procfile not used)

## Current Status

Your Procfile is correct! The issue might be that Heroku needs to be restarted or the Procfile needs to be redeployed.

