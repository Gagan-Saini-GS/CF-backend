const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  brand: String,
  gender: String,
  category: String,
  materials: String,
  description: String,
  quantity: Number,
  sizes: [],
  colors: [],
  productImages: [],
  reviews: [],
  questions: [],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product = new mongoose.model("product", productSchema);

module.exports = Product;
