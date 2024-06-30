const User = require("../../models/Users");
const Product = require("../../models/Products");
const jwt = require("jsonwebtoken");

const removeItem = async (req, res) => {
  try {
    const productID = req.body.productId;
    const authToken = req.body.authToken;

    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) console.log(err);
      // Because I can't getting the full user from authToken so I have to find it.
      const foundUser = await User.findOne({ email: user.email });
      if (!foundUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const userCart = await foundUser.cart;

      const products = await userCart.filter(
        (product) => product !== productID
      );
      foundUser.cart = products;
      await foundUser.save();

      const cartItems = products;

      for (let i = 0; i < cartItems.length; i++) {
        const product = await Product.findOne({ _id: cartItems[i] });
        products.push(product);
      }
      res.json({ products });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { removeItem };
