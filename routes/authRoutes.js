const express = require("express");
const { signup, login } = require("../controller/authController");
const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({
    msg: "Auth route is running well",
  });
});

// signup route

router.post("/signup", signup);

// login route

router.post("/login", login);

module.exports = router;
