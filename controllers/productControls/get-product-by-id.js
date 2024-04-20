const Product = require("../../models/Products");

const getProductById = async (req, res) => {
  try {
    const productID = req.body.productID;
    const foundProduct = await Product.findById(productID);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ foundProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { getProductById };
