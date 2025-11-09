# Image URL Fix for Deployment

## The Problem

The path `api/images/menu-items/chicken_shawarma_wrap-1762505617556.jpeg` doesn't work because:

1. **Missing leading slash**: Should be `/api/images/file/...` not `api/images/...`
2. **Wrong route**: Should use `/api/images/file/:key` not `/api/images/menu-items/...`
3. **Image key format**: The `image_key` in database might be just the filename or include `menu-items/` prefix

## How It Works

### Route Structure
- **Route**: `/api/images/file/:key`
- **Example**: `/api/images/file/chicken_shawarma_wrap-1762505617556.jpeg`
- **Backend**: Prepends `menu-items/` → `menu-items/chicken_shawarma_wrap-1762505617556.jpeg`
- **CDN**: Returns `${CDN_URL}/menu-items/chicken_shawarma_wrap-1762505617556.jpeg`

### Image Key Format
The `image_key` stored in database should be:
- ✅ **Just filename**: `chicken_shawarma_wrap-1762505617556.jpeg`
- ❌ **NOT full path**: `menu-items/chicken_shawarma_wrap-1762505617556.jpeg`

## Fixes Applied

### 1. Updated Images Route (`backend/routes/images.js`)
- Now handles both formats (with or without `menu-items/` prefix)
- Uses `:key(*)` to capture paths with slashes
- Automatically adds `menu-items/` if missing

### 2. Updated S3 Utility (`backend/utils/s3.js`)
- Handles CDN_URL with or without trailing slash
- Handles fileKey with or without leading slash
- Ensures proper URL construction

### 3. Frontend URL (`src/components/MenuSection.jsx`)
- Uses relative URL: `/api/images/file/${item.image_key}`
- Works in both development and production
- No need for `window.location.origin`

## Correct Usage

### Frontend
```jsx
// ✅ Correct
image={`/api/images/file/${item.image_key}`}

// ❌ Wrong - don't use window.location.origin
image={`${window.location.origin}/api/images/file/${item.image_key}`}

// ❌ Wrong - don't include menu-items/ in the path
image={`/api/images/menu-items/${item.image_key}`}
```

### Database
```sql
-- ✅ Correct - just filename
image_key = 'chicken_shawarma_wrap-1762505617556.jpeg'

-- ❌ Wrong - don't include menu-items/ prefix
image_key = 'menu-items/chicken_shawarma_wrap-1762505617556.jpeg'
```

## Environment Variables

Make sure `CDN_URL` is set in Heroku:
```bash
heroku config:set CDN_URL=https://your-cdn-url.com --app mcdonair
```

**Important**: CDN_URL should:
- ✅ Include protocol: `https://cdn.example.com`
- ✅ Can have or not have trailing slash: `https://cdn.example.com/` or `https://cdn.example.com`
- ❌ Should NOT include `menu-items/` path

## Testing

### Test the route:
```bash
# Should work
curl https://mcdonair.herokuapp.com/api/images/file/chicken_shawarma_wrap-1762505617556.jpeg

# Should redirect to CDN URL
# Example: https://your-cdn.com/menu-items/chicken_shawarma_wrap-1762505617556.jpeg
```

## Summary

✅ **Use**: `/api/images/file/${item.image_key}`
❌ **Don't use**: `api/images/menu-items/${item.image_key}` (missing leading slash, wrong route)

The backend now handles both cases automatically!

