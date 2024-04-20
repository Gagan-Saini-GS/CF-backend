const User = require("../../models/Users");
const Product = require("../../models/Products");
const jwt = require("jsonwebtoken");

const accessCartItems = async (req, res) => {
  try {
    jwt.verify(
      req.body.authToken,
      process.env.AUTH_TOKEN,
      async (err, user) => {
        if (err) console.log(err);
        const products = [];

        // Because I can't getting the full user from authToken so I have to find it.

        const foundUser = await User.findOne({ userEmail: user.useremail });
        if (!foundUser) {
          res.status(404).json({ error: "User not found" });
          return;
        }

        const userCart = await foundUser.cart;

        for (let i = 0; i < userCart.length; i++) {
          const product = await Product.findOne({ _id: userCart[i] });
          products.push(product);
        }
        res.json({ products });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { accessCartItems };
