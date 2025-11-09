
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Initialize PostgreSQL database connection
const pg = require("pg");

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
// app.get("/", (req, res) => {
//   res.json({
//     message: "McDonair Backend API",
//     status: "running",
//     timestamp: new Date().toISOString()
//   });
// });

// Initialize PostgreSQL database connection
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set!");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring database client:", err);
    // Don't exit - let the app start and handle errors gracefully
    return;
  }
  console.log("✅ Connected to the database");
  release();
});

//pass pool to all routes as middleware
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Meta routes
const metaRouter = require("./routes/meta");
const { router: usersRouter } = require("./routes/users");
const menuRouter = require("./routes/menu");
const imagesRouter = require("./routes/images");
// Users routes
app.use("/api/meta", metaRouter);
app.use("/api/users", usersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/images", imagesRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});




// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from dist folder (Vite builds to dist/)
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Catch all handler: send back React's index.html file for client-side routing
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`
      });
    }
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
} else {
  // 404 handler for development (when not serving frontend)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
      message: `Cannot ${req.method} ${req.originalUrl}`
    });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 McDonair Backend Server running on port ${PORT}`);
  // console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  // console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Server shutting down gracefully...");
  process.exit(0);
});
