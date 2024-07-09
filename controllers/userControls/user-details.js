const getUserDetails = async (req, res) => {
  try {
    const foundUser = req.user;
    const userDetails = {
      name: foundUser.name,
      email: foundUser.email,
      phoneNumber: foundUser.phoneNumber,
      address: foundUser.address,
      profileImage: foundUser.profileImage,
      website: foundUser.website,
      orders: foundUser.orders,
      isSeller: foundUser.isSeller,
    };

    res.json({ userDetails });
  } catch (error) {
    console.log("Issue: Can't get user details. ", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = { getUserDetails };
