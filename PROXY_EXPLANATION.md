# Proxy Configuration for Deployment

## How It Works

### Development (Local)
- **Frontend**: Runs on `http://localhost:3000` (Vite dev server)
- **Backend**: Runs on `http://localhost:5001` (Express server)
- **Proxy**: Vite proxy forwards `/api/*` requests to `http://localhost:5001`
- **API Calls**: Use relative URLs (`/api/...`) which get proxied automatically

### Production (Heroku)
- **Frontend & Backend**: Both served from same origin (e.g., `https://mcdonair.herokuapp.com`)
- **No Proxy Needed**: Since they're on the same origin, relative URLs work directly
- **API Calls**: Use relative URLs (`/api/...`) which go to the same server

## Current Configuration

### Vite Config (`vite.config.ts`)
```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5001",  // Only used in development
      changeOrigin: true,
      secure: false,
      ws: true,
    },
  },
}
```
**Note**: This proxy is ONLY used during `npm run dev`. It's ignored in production builds.

### API Config (`src/components/users/api.ts`)
```typescript
// Use relative URLs - works in both dev and production
const API_URL = import.meta.env.VITE_API_URL || "";
```

**How it works:**
- **Development**: Empty string = relative URLs → Vite proxy handles it
- **Production**: Empty string = relative URLs → Same origin, no proxy needed
- **Optional**: Set `VITE_API_URL` if you need a different API server

## Deployment Options

### Option 1: Same Origin (Current Setup) ✅
- Frontend and backend on same Heroku app
- API calls use relative URLs (`/api/...`)
- No configuration needed!

### Option 2: Separate Apps
If you deploy frontend and backend separately:

1. **Set environment variable** in frontend app:
   ```bash
   heroku config:set VITE_API_URL=https://your-backend-app.herokuapp.com --app your-frontend-app
   ```

2. **Rebuild frontend** (Vite needs env vars at build time):
   ```bash
   npm run build
   git add dist/
   git commit -m "Rebuild with API URL"
   git push heroku master
   ```

## Current Setup (Recommended)

Your current setup is correct:
- ✅ API uses relative URLs (`""`)
- ✅ Vite proxy only for development
- ✅ Production: Same origin, no proxy needed
- ✅ No environment variables needed

## Testing

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev
```
API calls to `/api/...` will be proxied to `localhost:5001`

### Production
```bash
# Build frontend
npm run build

# Deploy to Heroku
git push heroku master
```
API calls to `/api/...` will go to the same Heroku app

## Summary

**You don't need to adjust anything!** Your current setup:
- ✅ Works in development (Vite proxy)
- ✅ Works in production (same origin)
- ✅ No changes needed

The proxy is automatically handled:
- **Development**: Vite proxy forwards requests
- **Production**: Same origin, direct requests

