require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/db-config");
const User = require("./models/Users");
const Product = require("./models/Products");
const { createUser } = require("./controllers/userControls/signup");
const { loginUser } = require("./controllers/userControls/login");
const { getUserDetails } = require("./controllers/userControls/user-details");
const {
  updateUserProfile,
} = require("./controllers/userControls/update-profile");
const { becomeSeller } = require("./controllers/userControls/become-seller");

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

const companies = ["nike", "adidas", "gucci", "puma", "louisvuitton"];
const prices = ["799", "1299", "1899", "2399", "3099"];
const categories = [
  "all-cloths",
  "tshirts",
  "shirts",
  "shoes",
  "hoodies",
  "others",
];

// Utility Functions
// (Should be in different files but I started this thing very late for this project)

// User Related Routes

app.post("/signup", createUser);
app.post("/login", loginUser);
app.post("/user-details", getUserDetails);
app.patch("/update-profile", updateUserProfile);
app.post("/become-seller", becomeSeller);

// Product Related Routes

app.post("/get-all-products", (req, res) => {
  Product.find({}, (err, foundProducts) => {
    if (err) {
      console.log(err);
    }

    res.json(foundProducts);
  });
});

app.post("/upload-product", (req, res) => {
  const temp = req.body.product;

  // I am using authToken to keep which product is uploaded by which seller.
  // Helps to build admin panel and seller panel.
  const authToken = req.body.authToken;

  const product = new Product({
    name: temp.name,
    price: Number(temp.price),
    company: temp.company.toLowerCase(),
    category: temp.category.toLowerCase(),
    productImg: temp.productImg,
    description: temp.description,
    sizes: temp.sizes,
    reviews: [],
    questions: [],
    seller: authToken,
  });

  product.save();
  res.json("OK");
});

app.post("/get-products", (req, res) => {
  const filter = req.body.filter;
  const priceFilter = Number(filter);
  // console.log(filter, priceFilter);

  if (!isNaN(priceFilter)) {
    Product.find({ price: { $lte: priceFilter } }, (err, foundProducts) => {
      if (err) {
        console.log(err);
      }
      res.json({ foundProducts });
    });
  } else {
    Product.find(
      {
        $or: [{ category: filter }, { company: filter }],
      },
      (err, foundProducts) => {
        if (err) {
          console.log(err);
        }

        res.json({ foundProducts });
      }
    );
  }
});

app.post("/get-product-with-id", (req, res) => {
  Product.findOne({ _id: req.body.productID }, (err, foundProduct) => {
    if (err) {
      console.log(err);
    }

    res.json({ foundProduct });
  });
});

app.post("/set-product-review", (req, res) => {
  const reviewContent = req.body.reviewContent;
  const starCount = req.body.starCount;
  const token = req.body.authToken;
  const productID = req.body.productID;

  jwt.verify(token, process.env.AUTH_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
      // User details is not right
      res.status(401);
    }

    Product.findOne({ _id: productID }, (err, product) => {
      if (err) {
        console.log(err);
      }

      const arr = product.reviews;
      arr.push({
        reviewContent: reviewContent,
        starCount: starCount,
        username: user.username,
      });

      product.save();
      res.json(product.reviews);
    });
  });
});

app.post("/ask-product-question", (req, res) => {
  // console.log(req.body);
  const productID = req.body.productID;
  const question = req.body.question;
  const answer = req.body.answer;
  const token = req.body.authToken;

  jwt.verify(token, process.env.AUTH_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
      // User details is not right
      res.status(401);
    }

    Product.findOne({ _id: productID }, (err, product) => {
      if (err) {
        console.log(err);
      }

      const arr = product.questions;
      arr.push({
        question: question,
        answer: answer,
        username: user.username,
      });

      product.save();
      res.json(product.questions);
    });
  });
});

app.post("/filtered-products", (req, res) => {
  const filter = req.body.filter;
  let finalFilter = "";
  let item = "";

  for (let i = 0; i < companies.length; i++) {
    if (companies[i] === filter) {
      item = "company";
      finalFilter = filter;
      break;
    }
  }

  for (let i = 0; i < categories.length; i++) {
    if (categories[i] === filter) {
      item = "category";
      finalFilter = filter;
      break;
    }
  }

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] === filter) {
      item = "price";
      finalFilter = Number(filter);
      break;
    }
  }

  if (item === "company") {
    Product.find({ company: finalFilter }, (err, products) => {
      if (err) {
        console.log(err);
      }

      res.json(products);
    });
  } else if (item === "category") {
    if (finalFilter === "all-cloths") {
      Product.find({}, (err, products) => {
        if (err) {
          console.log(err);
        }

        res.json(products);
      });
    } else {
      Product.find({ category: finalFilter }, (err, products) => {
        if (err) {
          console.log(err);
        }

        res.json(products);
      });
    }
  } else if (item === "price") {
    Product.find({ price: { $lte: finalFilter } }, (err, products) => {
      if (err) {
        console.log(err);
      }

      res.json(products);
    });
  }
});

app.post("/add-to-cart", (req, res) => {
  // console.log(req.body);
  const authToken = req.body.authToken;
  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
    }
    // console.log(user);

    User.findOne({ userEmail: user.useremail }, (err, foundUser) => {
      if (err) {
        console.log(err);
      }
      // console.log(foundUser);
      const x = foundUser.cart;
      x.push(req.body.productID);
      foundUser.save();

      const status = "OK";
      res.json(status);
    });
  });
});

app.post("/access-cart-items", (req, res) => {
  jwt.verify(req.body.authToken, process.env.AUTH_TOKEN, (err, user) => {
    var products = [];
    if (err) {
      console.log(err);
    }

    // Because I can't getting the full user from authToken so I have to find it.
    User.findOne({ userEmail: user.useremail }, async (err, foundUser) => {
      if (err) {
        console.log(err);
      }

      const x = foundUser.cart;

      for (let i = 0; i < x.length; i++) {
        let productFind = new Promise((resolve, reject) => {
          Product.findOne({ _id: x[i] }, (err, product) => {
            if (err) {
              console.log(err);
              reject("Error occured so promise rejected");
            }
            resolve(product);
          });
        });

        const product = await productFind;
        products.push(product);
      }

      res.json({ products });
    });
  });
});

app.post("/remove-item", (req, res) => {
  const productID = req.body.productID;
  const authToken = req.body.authToken;
  var products = [];

  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
    }

    User.findOne({ userEmail: user.useremail }, async (err, foundUser) => {
      if (err) {
        console.log(err);
      }

      const arr = foundUser.cart;
      let temp = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== productID) {
          temp.push(arr[i]);
        }
      }

      foundUser.cart = temp;
      foundUser.save();

      const x = foundUser.cart;

      for (let i = 0; i < x.length; i++) {
        let productFind = new Promise((resolve, reject) => {
          Product.findOne({ _id: x[i] }, (err, product) => {
            if (err) {
              console.log(err);
              reject("Error occured so promise rejected");
            }
            resolve(product);
          });
        });

        const product = await productFind;
        products.push(product);
      }

      res.json(products);
    });
  });
});

app.post("/buy-product", (req, res) => {
  const productID = req.body.productID;
  const authToken = req.body.authToken;

  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, founduser) => {
    if (err) {
      console.log(err);
    }

    User.findOne({ userEmail: founduser.useremail }, (err, user) => {
      if (err) {
        console.log(err);
      }
      // console.log(user);
      const x = {
        name: user.userName,
        email: user.userEmail,
        phoneNumber: user.phoneNumber,
        address: user.address,
      };

      Product.findOne({ _id: productID }, (err, product) => {
        if (err) {
          console.log(err);
        }

        const y = {
          productImg: product.productImg,
          name: product.name,
          price: product.price,
        };

        res.json({ x, y });
      });
    });
  });
});

app.post("/checkout-product", (req, res) => {
  const authToken = req.body.authToken;
  const productID = req.body.productID;

  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, founduser) => {
    if (err) {
      console.log(err);
    }

    User.findOne({ userEmail: founduser.useremail }, (err, user) => {
      if (err) {
        console.log(err);
      }
      // console.log(user);
      // const x = {
      //   name: user.userName,
      //   email: user.userEmail,
      //   phoneNumber: user.phoneNumber,
      //   address: user.address,
      // };

      Product.findOne({ _id: productID }, (err, product) => {
        if (err) {
          console.log(err);
        }

        const x = user;
        x.orders.push(product);
        x.save();
        // const y = {
        //   productImg: product.productImg,
        //   name: product.name,
        //   price: product.price,
        // };
        // res.json({ x, y });
        res.json("OK");
      });
    });
  });
});

app.post("/search-product", (req, res) => {
  const searchQuery = req.body.searchQuery.toLowerCase();
  let finalProducts = [];

  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    }

    // Find those products whose product Name or description or Company
    // Name matches to your search query.

    for (let i = 0; i < products.length; i++) {
      const productName = products[i].name;
      const companyName = products[i].company;
      const description = products[i].description;

      let index = productName.search(searchQuery);
      if (index !== -1) {
        finalProducts.push(products[i]);
      } else {
        index = companyName.search(searchQuery);
        if (index !== -1) {
          finalProducts.push(products[i]);
        } else {
          index = description.search(searchQuery);
          if (index !== -1) {
            finalProducts.push(products[i]);
          }
        }
      }
    }

    res.json(finalProducts);
  });
});

app.listen(port, () => {
  console.log("Server is running at port 5000");
});
