require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = 5000;
const saltRounds = 10;

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

mongoose.connect("mongodb://localhost:27017/ClosetFashionDB");

const userSchema = new mongoose.Schema({
  userID: String,
  userName: String,
  userEmail: String,
  userProfileImg: String,
  password: String,
  phoneNumber: String,
  address: String,
  website: String,
  cart: [],
  orders: [],
  recentsProducts: [],
  isSeller: Boolean,
  PANCardNumber: String,
  GSTNumber: String,
  TandC: Boolean,
});

const sellerSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  phoneNumber: Number,
  PANCardNumber: String,
  GSTNumber: String,
  TandC: Boolean,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  company: String,
  productImg: String,
  description: String,
  reviews: [],
  questions: [],
  sizes: [],
});

const User = new mongoose.model("user", userSchema);
const SellerUser = new mongoose.model("selleruser", sellerSchema);
const Product = new mongoose.model("product", productSchema);

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

app.post("/signup", (req, res) => {
  bcrypt.hash(req.body.user.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      const newUser = new User({
        userName: req.body.user.username,
        userEmail: req.body.user.useremail,
        userProfileImg: "",
        password: hash,
        phoneNumber: "",
        address: "",
        website: "",
        orders: [],
      });

      newUser.save();

      // const user = {
      //   username: req.body.user.username,
      //   useremail: req.body.user.useremail,
      // };
      // console.log(user);

      const authToken = jwt.sign(
        {
          username: req.body.user.username,
          useremail: req.body.user.useremail,
          password: hash,
        },
        process.env.AUTH_TOKEN
      );

      // jwt.verify(authToken, process.env.AUTH_TOKEN, (err, founduser) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(founduser);
      //   }
      // });

      res.json({ authToken: authToken });
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({ userEmail: req.body.user.useremail }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      bcrypt.compare(
        req.body.user.password,
        foundUser.password,
        (err, result) => {
          if (!err && result === true) {
            const authToken = jwt.sign(
              {
                useremail: req.body.user.useremail,
                password: foundUser.password,
              },
              process.env.AUTH_TOKEN
            );
            res.json({ authToken: authToken });
          }
        }
      );
    }
  });
});

app.post("/become-seller", (req, res) => {
  const authToken = req.body.authToken;

  jwt.verify(authToken, process.env.AUTH_TOKEN, function (err, user) {
    if (err) {
      console.log(err);
      res.status(403);
    }

    User.findOne({ userEmail: user.useremail }, (err, finalUser) => {
      if (err) {
        console.log(err);
        res.status(403);
      }

      const foundUser = finalUser;
      foundUser.isSeller = true;
      // foundUser.userEmail = req.body.sellerEmail;
      // foundUser.phoneNumber = req.body.sellerPhoneNumber;
      foundUser.PANCardNumber = req.body.sellerPANCardNumber;
      foundUser.GSTNumber = req.body.sellerGSTNumber;
      foundUser.TandC = true;

      foundUser.save();
    });
    // const newSeller = new SellerUser({
    //   userName: user.username,
    // });
    // newSeller.save();
  });

  const data = "OK";
  res.json({ data });
});

app.post("/user-details", (req, res) => {
  const authToken = req.body.authToken;
  // console.log(authToken);
  jwt.verify(authToken, process.env.AUTH_TOKEN, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      // console.log(user);
      User.findOne({ userEmail: user.useremail }, (err, foundUser) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(foundUser);
          // console.log(foundUser.userName);
          res.json({ foundUser });
        }
      });
    }
  });
});

app.post("/update-profile", (req, res) => {
  const user = req.body.user;
  const authToken = req.body.authToken;

  let ans;

  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, foundUser) => {
    if (!err) {
      // console.log("Found User");
      // console.log(foundUser);
      User.findOne({ userEmail: foundUser.useremail }, (err, finalUser) => {
        if (err) {
          console.log(err);
          ans = "ERROR";
        } else {
          // console.log("Final User");
          // console.log(finalUser);
          const x = finalUser;

          x.userProfileImg = user.userProfileImg;
          x.phoneNumber = user.phonenumber;
          x.address = user.address;
          x.website = user.website;
          x.save();
          ans = "DONE";
        }
      });
    }
  });

  res.json({ ans });
});

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
  // const authToken = req.body.authToken;
  // console.log(authToken);
  // jwt.verify(authToken, process.env.AUTH_TOKEN, (err, foundUser) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   User.findOne({ userEmail: foundUser.useremail }, (err, user) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     const x = user;
  //     x.recentsProducts.push(req.body.productID);
  //     console.log(req.body.productID);
  //     x.save();
  //   });
  // });

  // console.log(req.body.productID);
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
