const mongoose = require("mongoose");

const addToCart = async (req, res) => {
  try {
    const userCart = await req.user.cart;

    if (!mongoose.Types.ObjectId.isValid(req.body.productID)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    await userCart.push(req.body.productID);
    await req.user.save();

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { addToCart };
