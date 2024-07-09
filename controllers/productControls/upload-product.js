const Product = require("../../models/Products");
const User = require("../../models/Users");

const uploadProduct = async (req, res) => {
  try {
    const productDetails = req.body.productDetails;

    // I am using authToken to keep which product is uploaded by which seller.
    // Helps to build admin panel and seller panel.
    const sellerId = await req.user._id;

    // Check if the seller (user) exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const product = new Product({
      name: productDetails.name,
      price: Number(productDetails.price),
      brand: productDetails.brand.toLowerCase(),
      gender: productDetails.gender.toLowerCase(),
      category: productDetails.category.toLowerCase(),
      materials: productDetails.materials.toLowerCase(),
      description: productDetails.description,
      sizes: productDetails.sizes.map((size) => size.name.toLowerCase()),
      colors: productDetails.colors.map((color) => color.color.toLowerCase()),
      productImages: productDetails.productImages,
      reviews: [],
      questions: [],

      // Use Seller Email or Id here insetead of complete detail.
      seller: sellerId,
    });

    await product.save();
    res.json("OK");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { uploadProduct };
