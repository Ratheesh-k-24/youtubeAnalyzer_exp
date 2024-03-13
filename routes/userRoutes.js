const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Video } = require("../model/schema");

// Login page GET
router.get("/login", (req, res) => {
  res.render("authentication", {
    action: "/api/users/login",
    buttonText: "Login",
  });
});

// Registration page GET
router.get("/register", (req, res) => {
  res.render("authentication", {
    action: "/api/users/register",
    buttonText: "Register",
  });
});

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });
    await user.save();

    // res.status(201).json({ msg: "User created successfully" });
    return res.redirect("/api/users/login");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Login route

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check userType
    if (user.userType === "admin") {
      // Render admin view
      const users = await User.find({});
      return res.redirect("/api/videos/user");
    } else {
      const videos = await Video.find(
        {},
        { video_name: 1, views: 1, subscription: 1 }
      ).sort({ views: -1 });
      // console.log(videos);
      // Render subscription view
      return res.redirect("/api/videos/views/subscription");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
