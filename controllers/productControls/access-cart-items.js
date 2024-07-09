const Product = require("../../models/Products");

const accessCartItems = async (req, res) => {
  try {
    const products = [];
    const userCart = await req.user.cart;

    for (let i = 0; i < userCart.length; i++) {
      const product = await Product.findById({ _id: userCart[i] });
      products.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        productImages: product.productImages,
        brand: product.brand,
        category: product.category,
        quantity: 1,
      });
    }
    await res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { accessCartItems };
