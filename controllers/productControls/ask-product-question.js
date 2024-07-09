const Product = require("../../models/Products");

const askProductQuestion = async (req, res) => {
  try {
    const { productID, question } = req.body;

    const foundProduct = await Product.findById(productID);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    const arr = await foundProduct.questions;
    await arr.push({
      question: question,
      name: req.user.name,
    });

    await foundProduct.save();
    res.json(foundProduct.questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { askProductQuestion };
