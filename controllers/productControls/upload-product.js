const Product = require("../../models/Products");

const uploadProduct = async (req, res) => {
  try {
    const productDetails = req.body.product;

    // I am using authToken to keep which product is uploaded by which seller.
    // Helps to build admin panel and seller panel.
    const authToken = req.body.authToken;

    const product = new Product({
      name: productDetails.name,
      price: Number(productDetails.price),
      company: productDetails.company.toLowerCase(),
      category: productDetails.category.toLowerCase(),
      productImg: productDetails.productImg,
      description: productDetails.description,
      sizes: productDetails.sizes,
      reviews: [],
      questions: [],
      seller: authToken,
    });

    await product.save();
    res.json("OK");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { uploadProduct };
