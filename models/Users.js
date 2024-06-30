const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: String,
  name: String,
  email: String,
  profileImage: String,
  password: String,
  phoneNumber: String,
  address: String,
  website: String,
  cart: [],
  orders: [],
  recentsProducts: [],
  isSeller: Boolean,
  sellerEmail: String,
  PANCardNumber: String,
  GSTNumber: String,
  TandC: Boolean,
});

const User = new mongoose.model("user", userSchema);

module.exports = User;
