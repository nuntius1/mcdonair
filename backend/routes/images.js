const express = require('express');
const router = express.Router();
const { getFileFromS3 } = require('../utils/s3');  
require('dotenv').config();

//load image from s3
// Use :key parameter - Express will capture everything after /file/
router.get('/file/:key', async (req, res) => {
    console.log('getting image from s3', req.params);
  try { 
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Image key is required"
      });
    }
    
    // Handle both cases: key might be just filename or include menu-items/ prefix
    let fileKey = key;
    if (!fileKey.startsWith('menu-items/')) {
      fileKey = `menu-items/${fileKey}`;
    }
    
    const imageUrl = await getFileFromS3(fileKey);
    console.log('Redirecting to CDN URL:', imageUrl);
    
    // Use 302 redirect (temporary redirect) for images
    res.redirect(302, imageUrl);
  } catch (error) {
    console.error("Error getting image from S3:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get image from S3",
      message: error.message
    });
  }
});

module.exports = router;