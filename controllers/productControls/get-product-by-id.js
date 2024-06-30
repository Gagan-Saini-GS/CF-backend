const Product = require("../../models/Products");
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const getProductById = async (req, res) => {
  try {
    const productID = req.body.productID;
    const foundProduct = await Product.findById(productID);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const seller = await User.findById(foundProduct.seller);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    let isProductAlreadyInCart = false;
    jwt.verify(
      req.body.authToken,
      process.env.AUTH_TOKEN,
      async (err, user) => {
        if (err) console.log(err);

        const foundUser = await User.findOne({ email: user.email });
        if (!foundUser) {
          res.status(404).json({ error: "User not found" });
          return;
        }

        const userCart = await foundUser.cart;

        if (userCart.includes(productID)) {
          isProductAlreadyInCart = true;
        }
        const sellerDetails = {
          name: seller.name,
          email: seller.email,
          phoneNumber: seller.phoneNumber,
        };

        res.json({ foundProduct, sellerDetails, isProductAlreadyInCart });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { getProductById };
