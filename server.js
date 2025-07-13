const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

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
