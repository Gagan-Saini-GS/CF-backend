const updatePhoneNumber = async (req, res) => {
  try {
    const foundUser = req.user;
    const phoneNumber = req.body.phoneNumber;

    // Update user profile
    foundUser.phoneNumber = phoneNumber || foundUser.phoneNumber;

    // Save updated user profile
    await foundUser.save();

    // Send response
    res.json({
      status: 200,
      message: "Phone number updated successfully.",
      data: foundUser,
    });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { updatePhoneNumber };
