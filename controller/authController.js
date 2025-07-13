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
    const hashedPassword = bcrypt.hash(password, 10);
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

const login = (req, res) => {
  try {
    const { email, passowrd } = req.body;
    const isExist = User.findOne({ email });
    if (!isExist) {
      return res.status(404).json({
        msg: "User does not exist with this email please signup",
      });
    }
    const isValid = bcrypt.compare(passowrd, isExist.passowrd);
    if (!isValid) {
      return res.status(404).json({
        msg: "wrong credentials provided",
      });
    }
    const jwtToken = jwt.sign(
      {
        userId: isExist._id,
        email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "User loggedin Successfully",
      token: jwtToken,
      userId: isExist._id,
      email: isExist.email,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

module.exports = { signup, login };
