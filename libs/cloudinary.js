import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload image to Cloudinary
export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'softer/products', // Organize images in folders
      resource_type: 'auto',
      format: 'webp', // Forzar conversión a WebP
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
        { quality: 'auto:best' }, // Mejor calidad automática
        { dpr: 'auto' }, // DPR automático para retina displays
        { fetch_format: 'webp' } // Asegurar formato WebP
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Generate optimized URL with transformations
export const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto:best',
    format: 'webp',
    fetch_format: 'webp',
    dpr: 'auto'
  };
  
  return cloudinary.url(publicId, {
    ...defaultOptions,
    ...options,
    secure: true
  });
};

export default cloudinary;