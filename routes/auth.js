// express
const express = require("express");
// database User
const { User } = require("../models/model");

// we require path to show where the file is to be stored
// we require fs to create a new file
const path = require("path");
const fs = require("fs");

// bcrypt for hashing passwords
const bcrypt = require("bcryptjs");

// handlers for file uploads
const multer = require("multer");
const { message } = require("statuses");

// storage location
const upload = multer({ dest: "uploads/" });

// importing jsonwebtoken that will be used in authentication
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
// router for the routes
const router = express.Router();

// register
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    // destructuring in order to access fields
    const { name, email, password } = req.body;
    // check if the users' email exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "email exists" });
    }

    // hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // declare the photo to a null variable
    let photo = null;

    // check if our request has any file
    if (req.file) {
      const ext = path.extname(req.file.originalname); //extracting the file's extention
      const newFilename = Date.now() + ext; //the file gets a new name that is the current time stamp and the extracted ext
      const newPath = path.join("uploads", newFilename); //the newFilename is given a new path
      fs.renameSync(req.file.path, newPath);
      photo = newPath.replace(/\\/g, "/");
    }

    // signin up and saving the user
    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  // destructuring to access email &password
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); //checking if the user exixts in the db
    if (!user) {
      return res.status(404).json({ message: "Wrong details" });
    }
    // if the user exixts the we check the password
    const valid = await bcrypt.compare(password, user.password); //checks if the plain text 'password' matches the hashed password in the db 'user.password'
    if (!valid) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    // generate a token for login
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    console.log(token);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
