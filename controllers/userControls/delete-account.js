const { default: mongoose } = require("mongoose");
const Product = require("../../models/Products");
const User = require("../../models/Users");

const deleteUserAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const result = await User.findByIdAndDelete(_id);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteUserAndProducts = async (req, res) => {
  const userId = req.user._id;

  // Start a session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete all products associated with the user
    await Product.deleteMany({ seller: userId }, { session });

    // Delete the user
    await User.deleteOne({ _id: userId }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { deleteUserAccount, deleteUserAndProducts };
