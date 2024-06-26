const User = require("../../models/Users");
const Product = require("../../models/Products");
const jwt = require("jsonwebtoken");

const buyProduct = async (req, res) => {
  try {
    const productID = req.body.productID;
    const authToken = req.body.authToken;

    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, authUser) => {
      if (err) console.log(err);

      const foundUser = await User.findOne({ email: authUser.email });
      if (!foundUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const userDetails = {
        name: await foundUser.name,
        email: await foundUser.email,
        phoneNumber: await foundUser.phoneNumber,
        address: await foundUser.address,
      };

      const foundProduct = await Product.findById(productID);
      if (!foundProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const productDetails = {
        productImages: await foundProduct.productImages,
        name: await foundProduct.name,
        price: await foundProduct.price,
        description: await foundProduct.description,
        sizes: await foundProduct.sizes,
        colors: await foundProduct.colors,
        category: await foundProduct.category,
        brand: await foundProduct.brand,
        quantity: 1,
      };

      res.json({ userDetails, productDetails });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { buyProduct };
