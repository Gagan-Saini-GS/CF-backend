const updateUserProfile = async (req, res) => {
  try {
    const foundUser = req.user;
    const user = req.body.user;

    // Update user profile
    foundUser.name = user.name || foundUser.name;
    foundUser.email = user.email || foundUser.email;
    foundUser.profileImage = user.profileImage || foundUser.profileImage;
    foundUser.phoneNumber = user.phoneNumber || foundUser.phoneNumber;
    foundUser.address = user.address || foundUser.address;
    foundUser.website = user.website || foundUser.website;

    // Save updated user profile
    await foundUser.save();

    // Send response
    res.json({
      status: 200,
      message: "Profile updated successfully.",
      data: foundUser,
    });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { updateUserProfile };
