const Product = require("../../models/Products");

const deleteProduct = async (req, res) => {
  try {
    const productId = req.body.productId;
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteProduct };
