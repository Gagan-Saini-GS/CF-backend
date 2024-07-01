const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const getUserDetails = async (req, res) => {
  try {
    const authToken = req.body.authToken;
    if (authToken === undefined || authToken === "" || authToken === null)
      return res
        .status(403)
        .json({ userDetails: null, message: "User not logged-in" });

    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        // Find user by email
        const foundUser = await User.findOne({ email: user.email });

        // Check if user exists
        if (!foundUser) {
          return res.status(401).json({ error: "Invalid email or password." });
        }

        const userDetails = {
          name: foundUser.name,
          email: foundUser.email,
          phoneNumber: foundUser.phoneNumber,
          address: foundUser.address,
          profileImage: foundUser.profileImage,
          website: foundUser.website,
          // cart: foundUser.cart,
          orders: foundUser.orders,
          isSeller: foundUser.isSeller,
        };

        res.json({ userDetails });
      }
    });
  } catch (error) {
    console.log("Issue: Can't get user details. ", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = { getUserDetails };
