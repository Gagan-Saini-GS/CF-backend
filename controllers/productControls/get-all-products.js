const Product = require("../../models/Products");

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();

    const products = await allProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
      productImages: product.productImages,
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts };
