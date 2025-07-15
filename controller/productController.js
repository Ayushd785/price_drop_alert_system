const extractASIN = require("../utils/extractAsin");
const scraper = require("../services/scraper");
const Product = require("../model/Product");

const productController = async (req, res) => {
  try {
    const { url } = req.body;
    // userId is sent in the JWT payload as "userId"
    const userId = req.user.userId || req.user._id; // fallback just in case

    const asin = extractASIN(url);
    if (!asin) {
      return res.status(404).json({
        msg: "ASIN did not found",
      });
    }
    const scrapedData = await scraper(asin);
    if (!scrapedData || !scrapedData.price) {
      return res.status(404).json({
        msg: "Price could not be fetched",
      });
    }
    const { title, price, image } = scrapedData;

    const product = new Product({
      userId,
      asin,
      url,
      title,
      image,
      initialPrice: price,
      lastPrice: price,
    });

    await product.save();

    res.status(200).json({
      msg: "Product fetched successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal issue",
      error: err.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const products = await Product.find({ userId });
    return res.status(200).json({
      msg: "Products fetched successfully",
      products,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal issue",
      error: err.message,
    });
  }
};

module.exports = { productController, getProducts };
