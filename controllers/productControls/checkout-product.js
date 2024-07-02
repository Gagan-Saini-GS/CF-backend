const checkoutProduct = async (req, res) => {
  const user = req.user;
  const products = req.body.products;

  user.orders = [...user.orders, ...products];
  await user.save();

  res.status(200).json({ message: "Checkout successful" });
};

module.exports = { checkoutProduct };
