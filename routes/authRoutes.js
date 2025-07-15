const express = require("express");
const { signup, login, getProfile } = require("../controller/authController");
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");

router.get("/test", (req, res) => {
  return res.status(200).json({
    msg: "Auth route is running well",
  });
});

// signup route

router.post("/signup", signup);

// login route

router.post("/login", login);

router.get("getProfile", userMiddleware, getProfile);

module.exports = router;
