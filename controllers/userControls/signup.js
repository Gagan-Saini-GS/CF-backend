const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 8;

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body.user;

    // Hash password
    const hash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      profileImage: "",
      password: hash,
      phoneNumber: "",
      address: "",
      website: "",
      cart: [],
      orders: [],
      recentsProducts: [],
      isSeller: false,
      PANCardNumber: "",
      GSTNumber: "",
      TandC: true,
    });

    // Save the new user
    await newUser.save();

    // Generate authentication token
    const authToken = jwt.sign(
      {
        _id: newUser._id,
        name: name,
        email: email,
        password: hash,
      },
      process.env.AUTH_TOKEN
    );

    // Send response with authentication token
    res.json({ authToken: authToken });
  } catch (error) {
    console.log("Signup Issue: Can't create new user. ", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = { createUser };
