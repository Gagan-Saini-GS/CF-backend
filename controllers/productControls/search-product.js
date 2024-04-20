const Product = require("../../models/Products");

const searchProduct = async (req, res) => {
  try {
    const searchQuery = req.body.searchQuery.toLowerCase();
    const products = await Product.find();

    const finalProducts = await products.filter((product) => {
      const { name, company, description } = product;

      const index1 = name.toString().toLowerCase().indexOf(searchQuery);
      const index2 = company.toString().toLowerCase().indexOf(searchQuery);
      const index3 = description.toString().toLowerCase().indexOf(searchQuery);

      if (index1 !== -1 || index2 !== -1 || index3 !== -1) {
        return product;
      }
    });

    res.json(finalProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchProduct };
