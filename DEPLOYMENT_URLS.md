# URL Configuration for Deployment

## Summary

All URLs have been updated to be deployment-compatible. They use **relative paths** which work in both development and production.

## Image URLs

### ✅ Static Images (Public Folder)
- `/images/icon.png` - Relative path, works in both dev and production
- `/images/hero_image.jpeg` - Relative path, works in both dev and production
- `/images/menu.jpg` - Relative path, works in both dev and production

### ✅ API Images
- `/api/images/file/${image_key}` - Relative path, works in both dev and production
  - **Development**: Vite proxy forwards to `localhost:5001`
  - **Production**: Same origin, direct request

### ✅ Banner Images
- Uses `getBannerImageUrl()` utility function
- Handles both relative paths and absolute URLs
- Falls back to `/images/hero_image.jpeg` if no banner URL

## API URLs

### ✅ API Endpoints
- `/api/meta/*` - Relative path
- `/api/users/*` - Relative path
- `/api/menu/*` - Relative path
- `/api/images/*` - Relative path

**Configuration**: `src/components/users/api.ts`
- Uses relative URLs (`""`) in both development and production
- Development: Vite proxy handles it
- Production: Same origin, direct request

## External URLs

### ✅ External Links (No Changes Needed)
- Skip the Dishes: `https://www.skipthedishes.com/...` - External link, works as-is
- Uber Eats: `https://www.ubereats.com/...` - External link, works as-is
- Google Maps: `https://www.google.com/maps/embed?...` - External iframe, works as-is

## Utility Functions

### `src/lib/imageUtils.ts`
Created utility functions for handling image URLs:
- `getImageUrl()` - Handles both relative and absolute URLs
- `getApiImageUrl()` - Gets API image endpoint URL
- `getBannerImageUrl()` - Gets banner image with fallback

## Files Updated

1. ✅ `src/components/users/api.ts` - Updated to use relative URLs
2. ✅ `src/components/HeroSection.jsx` - Uses `getBannerImageUrl()` utility
3. ✅ `src/components/MenuSection.jsx` - Already uses relative API URLs
4. ✅ `src/lib/imageUtils.ts` - New utility file for image URL handling

## Verification

All URLs are now:
- ✅ Relative paths (work in both dev and production)
- ✅ No hardcoded `localhost` URLs
- ✅ No hardcoded absolute URLs (except external links)
- ✅ Compatible with deployment

## Testing

### Local Development
```bash
npm run dev
# All relative URLs work via Vite proxy
```

### Production Build
```bash
npm run build
# All relative URLs work on same origin
```

## Summary

**No further changes needed!** All URLs are deployment-compatible:
- ✅ Static images: Relative paths
- ✅ API images: Relative paths
- ✅ API endpoints: Relative paths
- ✅ External links: Absolute URLs (correct)

