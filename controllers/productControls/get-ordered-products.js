const Product = require("../../models/Products");

const getOrderedProducts = async (req, res) => {
  try {
    const orders = req.body.orders;

    const products = await Promise.all(
      orders.map(async (order) => {
        const product = await Product.findById(order._id);
        // Ensure product exists before accessing properties
        if (product) {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            productImages: product.productImages,
            brand: product.brand,
            category: product.category,
            quantity: order.quantity,
          };
        } else {
          // Handle case where product is not found
          throw new Error(`Product with id ${order._id} not found`);
        }
      })
    );

    await res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { getOrderedProducts };
