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
const { getProduct } = require("./controllers/productControls/get-product");
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
const {
  filteredProducts,
} = require("./controllers/productControls/filtered-products");
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

const port = 5000;

const app = express();
app.use(cors());
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

// Tested

// User Related Routes
app.post("/signup", createUser);
app.post("/login", loginUser);
app.post("/user-details", getUserDetails);
app.patch("/update-profile", updateUserProfile); // Need to Turn Off CORS for this (I don't why?)
app.post("/become-seller", becomeSeller);

// Product Related Routes
app.get("/get-all-products", getAllProducts);
app.post("/get-product-with-id", getProductById);
app.post("/ask-product-question", askProductQuestion);
app.post("/set-product-review", setProductReview);
app.post("/add-to-cart", addToCart);
app.post("/access-cart-items", accessCartItems);
app.post("/upload-product", uploadProduct);
app.post("/filtered-products", filteredProducts);
app.post("/buy-product", buyProduct);
app.post("/checkout-product", checkoutProduct);
app.post("/search-product", searchProduct);
// app.get("/get-product", getProduct); // No Need -> Not Calling from anywhere I think it's same as filteredProducts

// Test more
// Working But taking too much time to load (need to refresh)
app.post("/remove-from-cart", removeItem);

app.listen(port, () => {
  console.log("Server is running at port 5000");
});
