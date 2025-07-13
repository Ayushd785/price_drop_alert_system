const User = require("../model/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isExist = await User.findOne({
      email,
    });
    if (isExist) {
      return res.status(403).json({
        message: "User already exists please try login",
      });
    }
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({
      msg: "User created Successfully",
    });
  } catch (Err) {
    return res.status(404).json({
      msg: "Server error",
      error: Err.message,
    });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: "User does not exist with this email, please signup",
      });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        msg: "Wrong credentials provided",
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SCERET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User logged in Successfully",
      token: jwtToken,
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

module.exports = { signup, login };
