const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userMiddleware = (req, res, next) => {
  const authHeader = req.headers.Authorization;
  if (!authHeader) {
    return res.status(404).json({
      msg: "Invalid token provided or token is missing",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(404).json({
      msg: "invalid token or token is missing ",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(404).json({
      msg: "Invalid token",
      error: err.message,
    });
  }
};

module.exports = userMiddleware;
