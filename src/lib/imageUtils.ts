/**
 * Utility functions for handling image URLs in both development and production
 */

/**
 * Get the full URL for an image
 * Handles both relative paths and absolute URLs
 * @param imagePath - Relative path (e.g., "/images/icon.png") or absolute URL
 * @returns The image URL (relative or absolute)
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "";
  
  // If it's already an absolute URL (http/https), return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // If it starts with /, it's already a relative path - return as-is
  // This works in both development and production
  if (imagePath.startsWith("/")) {
    return imagePath;
  }
  
  // Otherwise, assume it's a relative path and add leading slash
  return `/${imagePath}`;
};

/**
 * Get the API image URL
 * @param imageKey - The image key from the database
 * @returns The API endpoint URL for the image
 */
export const getApiImageUrl = (imageKey: string | null | undefined): string => {
  if (!imageKey) return "";
  return `/api/images/file/${imageKey}`;
};

/**
 * Get the banner image URL
 * Handles both database URLs and fallback paths
 * @param bannerUrl - Banner URL from database (could be full URL or relative)
 * @param fallback - Fallback relative path
 * @returns The banner image URL
 */
export const getBannerImageUrl = (
  bannerUrl: string | null | undefined,
  fallback: string = "/images/hero_image.jpeg"
): string => {
  if (bannerUrl) {
    return getImageUrl(bannerUrl);
  }
  return fallback;
};

