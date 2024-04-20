const Product = require("../../models/Products");

const getProduct = async (req, res) => {
  try {
    const filter = req.body.filter;
    const priceFilter = Number(filter);

    if (!isNaN(priceFilter)) {
      const foundProduct = await Product.findOne({
        price: { $lte: priceFilter },
      });
      res.json({ foundProduct });
    } else {
      const foundProduct = await Product.findOne({
        $or: [{ category: filter }, { company: filter }],
      });
      res.json({ foundProduct });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProduct };
