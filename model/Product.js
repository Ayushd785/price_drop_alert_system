const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asin: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String },
    image: { type: String },
    initialPrice: { type: Number, required: true },
    lastPrice: { type: Number, required: true },
  },
  { Timestamp: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
