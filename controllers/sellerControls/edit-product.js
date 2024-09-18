const Product = require("../../models/Products");

const editProduct = async (req, res) => {
  try {
    const productDetails = req.body.productDetails;
    const productId = productDetails._id;

    const product = await Product.findById(productId);

    product.name = productDetails.name;
    product.price = Number(productDetails.price);
    product.brand = productDetails.brand.toLowerCase();
    product.gender = productDetails.gender.toLowerCase();
    product.category = productDetails.category.toLowerCase();
    product.materials = productDetails.materials.toLowerCase();
    product.description = productDetails.description;
    product.quantity = Number(productDetails.quantity);
    product.sizes = productDetails.sizes.map((size) => size.name.toLowerCase());
    product.colors = productDetails.colors.map((color) =>
      color.color.toLowerCase()
    );
    product.productImages = productDetails.productImages;

    await product.save();

    res.status(200).json({
      product: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { editProduct };
