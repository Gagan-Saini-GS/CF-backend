const Product = require("../../models/Products");

const getAllProducts = async (req, res) => {
  try {
    const selectedFilters = req.body.filters;

    const filters = {
      price: {
        minimum: selectedFilters.price[0].minimum,
        maximum: selectedFilters.price[0].maximum,
      },
      brands: [...selectedFilters.brands],
      sizes: [...selectedFilters.sizes],
      genders: [...selectedFilters.genders],
      materials: [...selectedFilters.materials],
      colors: [...selectedFilters.colors],
    };

    // Initialize query object
    let query = {};

    // Apply price filter if provided
    if (
      filters.price.minimum !== undefined ||
      filters.price.maximum !== undefined
    ) {
      query.price = {};
      if (filters.price.minimum !== undefined) {
        query.price.$gte = parseFloat(filters.price.minimum);
      }
      if (filters.price.maximum !== undefined) {
        query.price.$lte = parseFloat(filters.price.maximum);
      }
    }

    // Apply brand filter if provided
    if (filters.brands.length > 0) {
      query.brand = { $in: filters.brands };
    }

    // Apply size filter if provided
    if (filters.sizes.length > 0) {
      query.sizes = { $in: filters.sizes };
    }

    // // Apply gender filter if provided
    if (filters.genders.length > 0) {
      query.gender = { $in: filters.genders };
    }

    // // Apply material filter if provided
    if (filters.materials.length > 0) {
      query.materials = { $in: filters.materials };
    }

    // Apply color filter if provided
    if (filters.colors.length > 0) {
      query.colors = { $in: filters.colors };
    }

    const allProducts = await Product.find(query);

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
