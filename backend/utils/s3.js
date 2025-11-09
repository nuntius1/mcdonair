
const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');
const path = require('path');
require('dotenv').config();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - S3 URL of uploaded file
 */
const uploadToS3 = async (fileBuffer, originalName, mimetype) => {
  try {
    
    // Generate unique filename
    const fileExtension = path.extname(originalName);
    const fileName = originalName;
    const key = `menu-items/${fileName}`;

    // Upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype
    };

    // Upload to S3
    const result = await s3.upload(params).promise();

    // Return the public URL
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Delete file from S3
 * @param {string} s3Url - S3 URL of the file to delete
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (s3Url) => {
  try {
    // Extract key from URL
    const url = new URL(s3Url);
    const key = url.pathname.substring(1); // Remove leading slash

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

const getFileFromS3 = async (fileKey) => {
  const cdn_url = process.env.CDN_URL;
  
  if (!cdn_url) {
    console.error('CDN_URL environment variable is not set');
    throw new Error('CDN_URL is not configured');
  }
  
  try {
    // Ensure CDN_URL has trailing slash and fileKey doesn't have leading slash
    const cleanCdnUrl = cdn_url.endsWith('/') ? cdn_url : `${cdn_url}/`;
    const cleanFileKey = fileKey.startsWith('/') ? fileKey.substring(1) : fileKey;
    const fullUrl = `${cleanCdnUrl}${cleanFileKey}`;
    console.log(`Constructed CDN URL: ${fullUrl}`);
    return fullUrl;
  } catch (error) {
    console.error('Error getting file from S3:', error);
    throw new Error('Failed to get file from S3');
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  getFileFromS3,
};

