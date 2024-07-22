const updateAddress = async (req, res) => {
  try {
    const foundUser = req.user;
    const address = req.body.address;

    // Update user profile
    foundUser.address = address || foundUser.address;

    // Save updated user profile
    await foundUser.save();

    // Send response
    res.json({
      status: 200,
      message: "Address updated successfully.",
      data: foundUser,
    });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { updateAddress };
