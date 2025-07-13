const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Mongodb connected");
  app.listen(process.env.PORT, () => {
    console.log("app is Running on port", process.env.PORT);
  });
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
