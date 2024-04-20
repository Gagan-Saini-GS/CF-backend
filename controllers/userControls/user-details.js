const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const getUserDetails = async (req, res) => {
  try {
    const authToken = req.body.authToken;
    jwt.verify(authToken, process.env.AUTH_TOKEN, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        // Find user by email
        const foundUser = await User.findOne({ userEmail: user.useremail });

        // Check if user exists
        if (!foundUser) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        res.json({ foundUser });
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
