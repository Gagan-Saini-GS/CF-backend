const User = require("../../models/Users");
const Product = require("../../models/Products");
const jwt = require("jsonwebtoken");

const checkoutProduct = async (req, res) => {
  try {
    const authToken = req.body.authToken;
    const productID = req.body.productID;

    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, authUser) => {
      if (err) {
        console.log(err);
      }

      const foundProduct = await Product.findById(productID);
      if (!foundProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const foundUser = await User.findOne({ userEmail: authUser.useremail });
      if (!foundUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const userOrders = await foundUser;
      await userOrders.orders.push(foundProduct);
      await userOrders.save();

      res.json("Checkout successful");
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { checkoutProduct };
