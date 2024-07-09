const Product = require("../../models/Products");

const removeItem = async (req, res) => {
  try {
    const productID = req.body.productId;
    const foundUser = req.user;

    const userCart = await foundUser.cart;

    const products = await userCart.filter((product) => product !== productID);
    foundUser.cart = products;
    await foundUser.save();

    const cartItems = products;

    for (let i = 0; i < cartItems.length; i++) {
      const product = await Product.findOne({ _id: cartItems[i] });
      products.push(product);
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { removeItem };
