require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");

const router = express.Router();
const sql = neon(process.env.DATABASE_URL);

// Get general store details
router.get('/general', async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM store_details ORDER BY id DESC LIMIT 1
    `;
    
    if (result.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: "No store details found"
      });
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error("Store details fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch store details",
      message: error.message
    });
  }
});

// Update general store details
router.post('/update', async (req, res) => {
  console.log("Update request body:", req.body);
 
  const { 
    data_name,
    short_name,
    long_name,
    store_description,
    our_menu_description, 
    address, 
    postal_code, 
    city, 
    province, 
    country, 
    phone, 
    email,
    banner_img_url,
    id } = req.body;

  const updated_by = "system";
  const created_by = "system";

  try {
    const pool = req.pool;
    const client = await pool.connect();
    
    // Check if a record exists
    let checkResult = await client.query("SELECT store_id FROM meta WHERE data_name = $1 ORDER BY store_id DESC LIMIT 1", [data_name]);
    
    let result;
    
    if (checkResult.rows.length > 0 && (checkResult.rows[0].store_id)) {
      // Update existing record
      const recordId = checkResult.rows[0].store_id;
      const query = `
        UPDATE meta 
        SET data_name = $1, short_name = $2, long_name = $3, store_description = $4, our_menu_description = $5, address = $6, postal_code = $7, city = $8, province = $9, country = $10, phone = $11, email = $12, created_by = $13, banner_img_url = $14
        WHERE store_id = $15
        RETURNING *
      `;
      const values = [data_name, short_name, long_name, store_description, our_menu_description, address, postal_code, city, province, country, phone, email, created_by, banner_img_url || null, recordId];
      result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        await client.release();
        return res.status(404).json({
          success: false,
          error: "Record not found"
        });
      }
    } else {
      // Insert new record
      const query = `
          INSERT INTO meta (data_name, short_name, long_name, store_description, our_menu_description, address, postal_code, city, province, country, phone, email, created_by, banner_img_url )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      const values = [data_name, short_name, long_name, store_description, our_menu_description, address, postal_code, city, province, country, phone, email, created_by, banner_img_url || null];
      result = await client.query(query, values);
    }
    
    console.log("Store details saved successfully", result.rows[0]);
    await client.release();

    res.json({
      success: true,
      message: "Store details saved successfully",
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error("Store details save error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save store details",
      message: error.message
    });
  }
});

// Get all meta data
router.get('/all-meta/:data_name', async (req, res) => {
  try {
    const pool = req.pool;
    const client = await pool.connect();
    const data_name = req.params.data_name || 'store_details';
    const result = await client.query(`SELECT * FROM meta WHERE data_name = $1`, [data_name]);
    await client.release();
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("All meta data fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch all meta data",
      message: error.message
    });
  }
});

module.exports = router;
