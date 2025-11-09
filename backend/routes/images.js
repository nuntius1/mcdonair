const express = require('express');
const router = express.Router();
const { getFileFromS3 } = require('../utils/s3');  
require('dotenv').config();

//load image from s3
router.get('/file/:key', async (req, res) => {
    console.log('getting image from s3', req.params);
  try { 
   
    const { key } = req.params;
    const image = await getFileFromS3('menu-items/' + key);
    console.log('image', image);
    res.redirect(image);
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