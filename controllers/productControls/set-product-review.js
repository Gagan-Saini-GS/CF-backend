const Product = require("../../models/Products");

const setProductReview = async (req, res) => {
  try {
    const { reviewContent, starCount, productID } = req.body;

    const foundProduct = await Product.findById(productID);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const arr = await foundProduct.reviews;
    await arr.push({
      reviewContent: reviewContent,
      starCount: starCount,
      name: req.user.name,
    });

    await foundProduct.save();
    res.json(foundProduct.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { setProductReview };
