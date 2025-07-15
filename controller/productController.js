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

    if (await Product.findOne({ title, userId })) {
      return res.status(400).json({
        msg: "Product already exists",
      });
    }

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

const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, userId });
    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }
    await product.deleteOne();
    return res.status(200).json({
      msg: "product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal error",
      error: err.message,
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { query } = req.query;
    console.log(`Search request - userId: ${userId}, query: ${query}`); // Debug log
    if (!query || query.trim() === "") {
      return res.status(400).json({
        msg: "valid search query is required",
      });
    }
    const products = await Product.find({
      userId: userId,
      title: {
        $regex: query,
        $options: "i",
      },
    });
    return res.status(200).json({
      msg: `found ${products.length} products of matching ${query}`,
      products,
    });
  } catch (Err) {
    return res.status(500).json({
      msg: "Internal error",
      error: Err.message,
    });
  }
};

module.exports = {
  productController,
  getProducts,
  deleteProduct,
  searchProduct,
};
