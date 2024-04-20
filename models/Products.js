const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  company: String,
  gender: String,
  description: String,
  productImg: [],
  reviews: [],
  questions: [],
  sizes: [],
});

const Product = new mongoose.model("product", productSchema);

module.exports = Product;
