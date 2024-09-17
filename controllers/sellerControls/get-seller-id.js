const getSellerId = async (req, res) => {
  res.status(200).json({ sellerId: req.user._id });
};

module.exports = getSellerId;
