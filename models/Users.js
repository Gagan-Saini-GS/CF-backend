const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: String,
  userName: String,
  userEmail: String,
  userProfileImg: String,
  password: String,
  phoneNumber: String,
  address: String,
  website: String,
  cart: [],
  orders: [],
  recentsProducts: [],
  isSeller: Boolean,
  PANCardNumber: String,
  GSTNumber: String,
  TandC: Boolean,
});

const User = new mongoose.model("user", userSchema);

module.exports = User;
