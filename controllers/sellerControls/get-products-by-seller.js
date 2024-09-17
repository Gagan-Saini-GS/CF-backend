const mongoose = require("mongoose");
const Product = require("../../models/Products");

// Function to get products by sellerId
const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id;
    // Validate if the sellerId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      throw new Error("Invalid seller ID");
    }

    // Query to find products with the matching sellerId
    const products = await Product.find({ seller: sellerId });

    res.status(200).json({ products: products });
  } catch (error) {
    console.error("Error fetching products by seller:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { getProductsBySeller };
