require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db-config");
const { createUser } = require("./controllers/userControls/signup");
const { loginUser } = require("./controllers/userControls/login");
const { getUserDetails } = require("./controllers/userControls/user-details");
const {
  updateUserProfile,
} = require("./controllers/userControls/update-profile");
const { becomeSeller } = require("./controllers/userControls/become-seller");
const {
  getAllProducts,
} = require("./controllers/productControls/get-all-products");
const {
  getProductById,
} = require("./controllers/productControls/get-product-by-id");
const {
  uploadProduct,
} = require("./controllers/productControls/upload-product");
const {
  askProductQuestion,
} = require("./controllers/productControls/ask-product-question");
const {
  setProductReview,
} = require("./controllers/productControls/set-product-review");
const { addToCart } = require("./controllers/productControls/add-to-cart");
const {
  accessCartItems,
} = require("./controllers/productControls/access-cart-items");
const { removeItem } = require("./controllers/productControls/remove-item");
const { buyProduct } = require("./controllers/productControls/buy-product");
const {
  checkoutProduct,
} = require("./controllers/productControls/checkout-product");
const {
  searchProduct,
} = require("./controllers/productControls/search-product");
const authenticateJWT = require("./middleware/authenticateUser");
const {
  getOrderedProducts,
} = require("./controllers/productControls/get-ordered-products");
const { updateAddress } = require("./controllers/userControls/update-address");
const {
  updatePhoneNumber,
} = require("./controllers/userControls/update-phonenumber");
const {
  deleteUserAccount,
  deleteUserAndProducts,
} = require("./controllers/userControls/delete-account");

const port = 5000;

const app = express();

// Use the cors middleware
app.use(
  cors({
    origin: ["https://closet-fashion.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Connecting Database by calling connectDB function
connectDB();

// User Related Routes
app.post("/signup", createUser);
app.post("/login", loginUser);

// Autheticated User JWT Routes
app.post("/user-details", authenticateJWT, getUserDetails);
app.post("/update-profile", authenticateJWT, updateUserProfile);
app.post("/update-address", authenticateJWT, updateAddress);
app.post("/update-phonenumber", authenticateJWT, updatePhoneNumber);
app.post("/become-seller", authenticateJWT, becomeSeller);
// app.post("/delete-account", authenticateJWT, deleteUserAccount);
app.post("/delete-account", authenticateJWT, deleteUserAndProducts);

// Product Related Routes
app.post("/search-product", searchProduct); // Not Working
app.post("/get-all-products", getAllProducts);

// Autheticated Products JWT Routes
app.post("/get-product-with-id", authenticateJWT, getProductById);
app.post("/add-to-cart", authenticateJWT, addToCart);
app.post("/access-cart-items", authenticateJWT, accessCartItems);
app.post("/upload-product", authenticateJWT, uploadProduct);
app.post("/buy-product", authenticateJWT, buyProduct);
app.post("/checkout-product", authenticateJWT, checkoutProduct);
app.post("/ordered-products", authenticateJWT, getOrderedProducts);
app.post("/remove-from-cart", authenticateJWT, removeItem);
app.post("/ask-product-question", authenticateJWT, askProductQuestion);
app.post("/set-product-review", authenticateJWT, setProductReview);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
