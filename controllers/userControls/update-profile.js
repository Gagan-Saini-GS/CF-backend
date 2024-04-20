const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const updateUserProfile = async (req, res) => {
  try {
    const user = req.body.user;
    const authToken = req.body.authToken;

    // Verify authentication token
    const decodedToken = jwt.verify(authToken, process.env.AUTH_TOKEN);
    const foundUser = await User.findOne({ userEmail: decodedToken.useremail });

    // If user not found, return error
    if (!foundUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user profile
    foundUser.userProfileImg = user.userProfileImg || foundUser.userProfileImg;
    foundUser.phoneNumber = user.phoneNumber || foundUser.phoneNumber;
    foundUser.address = user.address || foundUser.address;
    foundUser.website = user.website || foundUser.website;

    // Save updated user profile
    await foundUser.save();

    // Send response
    res.json({ status: 200 });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { updateUserProfile };
