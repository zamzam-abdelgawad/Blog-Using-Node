const express = require("express");
const User = require("../models/users");
const Blog = require("../models/blog");
const bodyParser = require("body-parser");
const path = require("path");
const route = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
route.use(express.static(path.join(__dirname, "../public/assets/")));
route.use(express.static("./uploads"));
const multer = require("multer");
const blog = require("../models/blog");
// route.user(express.static('/uploads'))
route.use(express.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, callbackfun) => {
    callbackfun(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname.replaceAll(" ", ""));
  },
});
const upload = multer({ storage: fileStorage });
route.use(cookieParser());
// route.use(bodyParser.urlencoded({ extended: true }));
route.use(express.urlencoded({ extended: true }));
route.post("/register", async function (req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashedPassword;

  let users = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  res.redirect("/user/login");
});
route.get("/login", async (req, res) => {
  let pathFile = path.join(__dirname, "..", "public", "login.html");
  res.sendFile(pathFile);
});
route.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        const token = jwt.sign({ user: user.id }, "shhhhh");
        // Set The Id In Cookie With Encryption
        res.cookie("userId", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/user/home");
      }
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
route.get("/logout", async (req, res) => {
  res.clearCookie("userId");
  res.redirect("/user/login");
});

route.get("/getAllBlogs", async (req, res) => {
  let allBlogs = await Blog.find({});
  res.send(allBlogs);
});
route.post("/getDataFromSearch", async (req, res) => {
  let val = req.body.searchValue;
  let allBlogs = await Blog.find({
    $or: [
      { title: { $regex: val, $options: "i" } },
      { body: { $regex: val, $options: "i" } },
      { tags: { $regex: val, $options: "i" } },
    ],
  });
  res.send(allBlogs);
});
// User Blogs :

route.get("/getUserBlogs", async (req, res) => {
  let userID = jwt.verify(req.cookies.userId, "shhhhh");
  let UserBlogs = await Blog.find({ author: userID.user });
  res.send(UserBlogs);
});

// USer Data
route.get("/getUserData", async (req, res) => {
  let userID = jwt.verify(req.cookies.userId, "shhhhh");
  let allUserData = await User.findById(userID.user);
  res.send(allUserData);
});
route.get("/home", async (req, res) => {
  let pathFile = path.join(__dirname, "..", "public", "home.html");
  res.sendFile(pathFile);
  // Get The Id From Cookie
});
route.get("/userblog", async (req, res) => {
  const myCookie = req.cookies["userId"];
  if (myCookie) {
    let pathFile = path.join(__dirname, "..", "public", "userblog.html");
    res.sendFile(pathFile);
  } else {
    res.redirect("/user/login");
  }
});

route.get("/profile", async (req, res) => {
  const myCookie = req.cookies["userId"];
  if (myCookie) {
    let pathFile = path.join(__dirname, "..", "public", "profile.html");
    res.sendFile(pathFile);
  } else {
    res.redirect("/user/login");
  }
});
// Add Blog From M odal TO DB

route.post(
  "/addBlog",
  upload.single("image"),
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    let userID = jwt.verify(req.cookies.userId, "shhhhh");
    let allUserData = await User.findById(userID.user);
    let newBlog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      image: req.file.filename,
      author: allUserData,
      tags: req.body.tags,
    });
    res.redirect("/user/userblog");
  }
);

route.delete("/delBlog/:id", async function (req, res) {
  let deleteData = await blog.deleteOne({ _id: req.params.id });
  res.send(deleteData);
});

// getBlogAuthor:

route.post("/getBlogAuthor", async function (req, res) {
  let blogAuthor = await User.findById(req.body.author);
  res.send(blogAuthor);
});

// Edit Blog :

route.put("/updateBlog/:id", async function (req, res) {
  let BlogData = await Blog.updateMany(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        body: req.body.BlogBody,
        image: req.body.file,
      },
    }
  );
  res.send(BlogData);
});

module.exports = route;
