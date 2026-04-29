/**
 * Generates a Cloudinary Fetch URL to optimize third-party images on the fly.
 * 
 * @param url - The original third-party image URL
 * @param width - Desired width for resizing (default: 400)
 * @returns The optimized Cloudinary URL
 */
export const getCloudinaryFetchUrl = (url: string, width: number = 400): string => {
  if (!url) return "";
  
  // Replace this with your actual Cloudinary Cloud Name
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Transformation string:
  // w_400: Resize to 400px width
  // q_auto: Automatic quality optimization
  // f_auto: Automatic format selection (WebP, AVIF, etc.)
  // c_fill: Crop to fill if both width and height are provided (optional)
  const transformations = `w_${width},q_auto,f_auto`;
  
  // Cloudinary Fetch URL structure:
  // https://res.cloudinary.com/<cloud-name>/image/fetch/<transformations>/<remote-url>
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformations}/${encodeURIComponent(url)}`;
};
