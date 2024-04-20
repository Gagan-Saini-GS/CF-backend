const Product = require("../../models/Products");
const { categories } = require("../../utils/categoryList");
const { companies } = require("../../utils/companyList");
const { prices } = require("../../utils/prices");

const filteredProducts = async (req, res) => {
  try {
    const filter = req.body.filter;
    let item = "";

    const isCompany = companies.includes(filter);
    if (isCompany) item = "company";

    const isCategory = categories.includes(filter);
    if (isCategory) item = "category";

    const isPrice = prices.includes(filter);
    if (isPrice) item = "price";

    let filterCriteria = {};

    if (filter === "all-cloths") filterCriteria = {};
    else if (item === "price") filterCriteria = { price: { $lte: filter } };
    else filterCriteria = { [item]: filter };

    const foundProducts = await Product.find(filterCriteria);
    res.json(foundProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { filteredProducts };
