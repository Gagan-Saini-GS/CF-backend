const User = require("../../models/Users");
const jwt = require("jsonwebtoken");

const becomeSeller = async (req, res) => {
  try {
    const authToken = req.body.authToken;

    jwt.verify(authToken, process.env.AUTH_TOKEN, (err, user) => {
      if (err) {
        console.log(err);
        res.status(403);
      }

      User.findOne({ email: user.email }, (err, finalUser) => {
        if (err) {
          console.log(err);
          res.status(403);
        }

        const foundUser = finalUser;
        foundUser.isSeller = true;
        foundUser.PANCardNumber = req.body.sellerPANCardNumber;
        foundUser.GSTNumber = req.body.sellerGSTNumber;
        foundUser.TandC = true;

        foundUser.save();
      });
    });

    const data = "OK";
    res.json({ data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

module.exports = { becomeSeller };
