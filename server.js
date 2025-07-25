const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins temporarily
    credentials: false, // Must be false when origin is "*"
  })
);
app.use(express.json());

// MongoDB connection for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Connect to database before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/api/test", (req, res) => {
  return res.json({
    msg: "backend route is running well",
  });
});

const authRoute = require("./routes/authRoutes");

// Mount the auth routes so that any path starting with "/api/auth" is handled by authRoute
app.use("/api/auth", authRoute);

const productRoute = require("./routes/productRoute");
const authMiddleware = require("./middleware/userMiddleware");

app.use("/api/product", authMiddleware, productRoute);

// Export the app for Vercel
module.exports = app;
