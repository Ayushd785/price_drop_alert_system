const express = require("express");
const {
  productController,
  getProducts,
} = require("../controller/productController");
const router = express.Router();

router.get("/test", (req, res) => {
  return res.status(200).json({
    msg: "product route running well",
  });
});

router.post("/track", productController);
router.get("/getProducts", getProducts);
module.exports = router;
