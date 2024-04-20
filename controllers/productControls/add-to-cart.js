const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const addToCart = async (req, res) => {
  try {
    const authToken = req.body.authToken;
    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) console.log(err);

      const foundUser = await User.findOne({ userEmail: user.useremail });
      if (!foundUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const userCart = await foundUser.cart;

      await userCart.push(req.body.productID);
      await foundUser.save();

      res.status(200).json({ message: "Product added to cart" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { addToCart };
