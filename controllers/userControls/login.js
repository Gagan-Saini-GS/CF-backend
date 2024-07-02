const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.user;

    // Find user by email
    const foundUser = await User.findOne({ email: email });

    // Check if user exists
    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare passwords
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    // If passwords match, generate authentication token
    if (passwordsMatch) {
      const authToken = jwt.sign(
        {
          _id: foundUser._id,
          email: email,
          password: foundUser.password,
        },
        process.env.AUTH_TOKEN
      );
      return res.json({ authToken: authToken });
    } else {
      // If passwords don't match, return error
      return res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = { loginUser };
