require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { neon } = require("@neondatabase/serverless");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

// Helper function to generate JWT token
const generateToken = (userData) => {
  return jwt.sign({...userData }, process.env.JWT_SECRET, { expiresIn: "4h" });
 };

// Middleware to verify JWT token
const authenticateToken = (accessToken) => {
  if (!accessToken) {
    console.error("Access token required");
    throw new Error("Access token required");
  }

  try {
      const user = jwt.verify(accessToken, process.env.JWT_SECRET);
      return user;

    } catch (err) {
      console.error("Error verifying token:", err);
      throw new Error("Invalid or expired token");
    }
};

// Register new user
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  console.log(email, password, firstName, lastName);

  try {
    // connect to database
    const pool = req.pool;
    //check if user already exists
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format"
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (email, password, firstName, lastName) VALUES ($1, $2, $3, $4) RETURNING user_id, email, firstName, lastName, account_verified`;
    const values = [email, hashedPassword, firstName, lastName];
    const result = await pool.query(query, values);
    console.log(result);
    
    res.status(200).json(
      {
        success: true,
        message: "User registered successfully",
        data: result[0]
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Failed to register user. Please try again.'
    });
  }
});

// Sign in / Login
router.post("/signin", async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  try {
    
    const pool = req.pool;

    const findUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
    if (findUser.rowCount == 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = findUser.rows[0];
    console.log(findUser);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    //account is approved
    if (!user.account_approved) {
      return res.status(401).json({
        success: false,
        message: "Account has not been approved yet. Please contact administrator for approval."
      });
    }

    // Generate JWT token

    const userData = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.first_name + " " + user.last_name,
      role: user.role,
      account_verified: user.account_verified
    }

    const accessToken = generateToken(userData);

    res.json({
      success: true,
      message: "Login successful",
      data: {...userData, access_token: accessToken}
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to login",
      message: error.message
    });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const pool = req.pool;

    // Find user by email
    const findUser = await pool.query(`SELECT user_id, email FROM users WHERE email = $1`, [email.toLowerCase()]);

    // Don't reveal if user exists or not for security
    if (findUser.rowCount === 0) {
      return res.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent"
      });
    }

    const user = findUser.rows[0];

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.user_id, type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store reset token in database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await pool.query(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET token = $2, expires_at = $3, created_at = NOW()
    `, [user.user_id, resetToken, expiresAt.toISOString()]);

    // In a real application, you would send an email with the reset link
    // For now, we'll return the token (in production, remove this)
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/reset-password?token=${resetToken}`;

    console.log(`Password reset link for ${user.email}: ${resetLink}`);

    res.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent",
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === "development" && { resetLink })
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process password reset request",
      message: error.message
    });
  }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required"
      });
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: "Password must be 6-16 characters long, contain at least one number and one special character (!@#$%^&*)"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token"
      });
    }

    if (decoded.type !== "password_reset") {
      return res.status(400).json({
        success: false,
        error: "Invalid token type"
      });
    }

    const pool = req.pool;

    // Check if token exists in database and is not expired
    const findToken = await pool.query(`
      SELECT * FROM password_reset_tokens
      WHERE user_id = $1 AND token = $2 AND expires_at > NOW()
    `, [decoded.userId, token]);

    if (findToken.rowCount === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token"
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await pool.query(`
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE user_id = $2
    `, [hashedPassword, decoded.userId]);

    // Delete used reset token
    await pool.query(`
      DELETE FROM password_reset_tokens WHERE user_id = $1
    `, [decoded.userId]);

    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset password",
      message: error.message
    });
  }
});

// Verify token (for protected routes) - Currently unused, keeping for future use
// router.get("/verify", async (req, res) => {
//   try {
//     const pool = req.pool;
//     const findUser = await pool.query(`
//       SELECT user_id, email, first_name, last_name FROM users WHERE user_id = $1
//     `, [req.user?.userId]);

//     if (findUser.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found"
//       });
//     }

//     const user = findUser.rows[0];
//     res.json({
//       success: true,
//       data: {
//         user: {
//           id: user.user_id,
//           email: user.email,
//           firstName: user.first_name,
//           lastName: user.last_name
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Verify token error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to verify token",
//       message: error.message
//     });
//   }
// });

// authenticate token
router.get("/auth", async (req, res) => {
  console.log('req.query', req.query);
  const accessToken = req.query.accessToken;
  

  if (!accessToken) {
    console.log('Access token required');
    return res.status(401).json({
      success: false,
      error: "Access token required"
    });
  }

  try {
    const user = authenticateToken(accessToken);
    console.log(user);
    res.json({ 
      success: true, 
      message: "Token authenticated successfully",
      data: {...user, access_token: accessToken} });
  } catch (error) {
    console.error("Authenticate token error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to authenticate token",
      message: error.message
    });
  }
});

module.exports = { router };

