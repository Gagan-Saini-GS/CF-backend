const Product = require("../../models/Products");

const getAllProducts = async (req, res) => {
  try {
    const { selectedFilters, searchQuery, page, limit } = req.body;
    let filterExist = false;

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
      filterExist = true;
    }

    // Apply size filter if provided
    if (filters.sizes.length > 0) {
      query.sizes = { $in: filters.sizes };
      filterExist = true;
    }

    // // Apply gender filter if provided
    if (filters.genders.length > 0) {
      query.gender = { $in: filters.genders };
      filterExist = true;
    }

    // // Apply material filter if provided
    if (filters.materials.length > 0) {
      query.materials = { $in: filters.materials };
      filterExist = true;
    }

    // Apply color filter if provided
    if (filters.colors.length > 0) {
      query.colors = { $in: filters.colors };
      filterExist = true;
    }

    // Apply search term filter if provided
    if (searchQuery && searchQuery.trim()) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
      ];
      filterExist = true;
    }

    // Calculate skip and limit for pagination, In filter product don't skip anything
    const offset = filterExist ? 0 : (page - 1) * limit;

    // Find products with pagination
    const allProducts = await Product.find(query).skip(offset).limit(limit);

    // Get total count of products matching the query for pagination info
    const totalProducts = await Product.countDocuments(query);

    const products = await allProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
      productImages: product.productImages,
    }));

    // Send response with products and pagination info
    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
    // res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts };
