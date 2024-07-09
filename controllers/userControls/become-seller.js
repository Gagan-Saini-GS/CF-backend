const becomeSeller = async (req, res) => {
  try {
    const foundUser = req.user;

    foundUser.isSeller = true;
    foundUser.PANCardNumber = req.body.sellerPANCardNumber;
    foundUser.GSTNumber = req.body.sellerGSTNumber;
    foundUser.TandC = true;

    await foundUser.save();

    const data = "OK";
    res.json({ data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { becomeSeller };
