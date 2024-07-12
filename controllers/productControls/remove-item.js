const removeItem = async (req, res) => {
  try {
    const productID = req.body.productId;
    const foundUser = req.user;

    const userCart = await foundUser.cart;

    const products = await userCart.filter((product) => product !== productID);
    foundUser.cart = products;
    await foundUser.save();

    await res.json({ message: "Item Removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = { removeItem };
