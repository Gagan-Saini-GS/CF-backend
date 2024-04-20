const Product = require("../../models/Products");
const jwt = require("jsonwebtoken");

const setProductReview = async (req, res) => {
  try {
    const { reviewContent, starCount, authToken, productID } = req.body;

    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid auth token." });
      }

      const foundProduct = await Product.findById(productID);
      if (!foundProduct) {
        return res.status(404).json({ message: "Product not found." });
      }

      const arr = await foundProduct.reviews;
      await arr.push({
        reviewContent: reviewContent,
        starCount: starCount,
        username: user.username,
      });

      await foundProduct.save();
      res.json(foundProduct.reviews);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { setProductReview };
