require("dotenv").config();
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadToS3 } = require("../utils/s3");

// Add menu item with image upload
router.post('/add-menu-item', upload.single('image'), async (req, res) => {
  console.log(req.body);
  try {
    const { name, description, price, category, image_key, created_by } = req.body;
   
    const file = req.file;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Validate file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "Image file is required"
      });
    }

    // Upload file to S3
    const imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    // Get database pool
    const pool = req.pool;
    const client = await pool.connect();

    try {
      // Insert menu item into database
      const query = `
        INSERT INTO menu_items (name, description, price, category, image_key, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [
        name,
        description,
        parseFloat(price),
        category,
        image_key,
        created_by
      ];

      const result = await client.query(query, values);

      res.json({
        success: true,
        message: "Menu item added successfully",
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Add menu item error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add menu item",
      message: error.message
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const pool = req.pool;
    const client = await pool.connect();

    try {
      const query = `SELECT * FROM menu_items`;
      const result = await client.query(query);
    //   console.log(result.rows);
      res.json({
        success: true,
        data: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get menu items",
      message: error.message
    });
  }
});

// Update menu item
router.put('/update-menu-item', upload.single('image'), async (req, res) => {
  try {
    const { unique_id, name, description, price, category, image_key, created_by } = req.body;
    console.log('req.body', req.body);
    const file = req.file;

    // Validate required fields
    if (!unique_id || !name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const pool = req.pool;
    const client = await pool.connect();

    try {
      let query;
      let values;

      // If a new image is uploaded, update it
      if (file) {
        const imageUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        query = `
          UPDATE menu_items 
          SET name = $1, description = $2, price = $3, category = $4, image_key = $5
          WHERE unique_id = $6
          RETURNING *
        `;
        values = [name, description, parseFloat(price), category, image_key, unique_id];
      } else {
        // Update without changing image
        query = `
          UPDATE menu_items 
          SET name = $1, description = $2, price = $3, category = $4, image_key = $5
          WHERE unique_id = $6
          RETURNING *
        `;
        values = [name, description, parseFloat(price), category, image_key, unique_id];
      }

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Menu item not found"
        });
      }

      res.json({
        success: true,
        message: "Menu item updated successfully",
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update menu item",
      message: error.message
    });
  }
});

router.delete('/delete', async (req, res) => {
    console.log('req.body', req.body);
  try {
    const unique_id  = req.body.id;
    console.log('unique_id', unique_id);
    const pool = req.pool;
    const client = await pool.connect();

    try {
      const query = `DELETE FROM menu_items WHERE unique_id = $1 RETURNING *`;
      const result = await client.query(query, [unique_id]);
      
      res.json({
        success: true,
        message: "Menu item deleted successfully",
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete menu item",
      message: error.message
    });
  }
});

module.exports = router;