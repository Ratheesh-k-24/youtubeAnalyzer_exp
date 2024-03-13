const express = require("express");
const router = express.Router();
const Video = require("../model/schema").Video;
const User = require("../model/schema").User;

//routes for admin view
router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);
    res.render("adminView", { users: users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);
    res.render("edit", { user });
  } catch (error) {
    console.error("Error fetching user data for editing:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/user/edit/:id", async (req, res) => {
  try {
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.redirect("/api/users/user");
    // console.log(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    const users = await User.find({});
    res.render("adminView", { users });
  } catch (error) {
    res.status(400).send("Error deleting the data");
  }
});

//routes for frequently commented user
router.get("/frequentUser", async (req, res) => {
  try {
    const frequentUser = await Video.aggregate([
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 7 },
    ]);
    console.log(frequentUser);
    res.render("frequentUser", { frequentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to retrieve all comments for a specific video
router.get("/:video_name", async (req, res) => {
  try {
    const { video_name } = req.params;
    const video = await Video.findOne({ video_name });
    if (!video) {
      return res.status(404).json({ message: "Videoss not found" });
    } else {
      res.render("comments", {
        filteredComments: video.comments,
        videoName: video_name,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to filter comments by sentiment for a specific video
router.get("/comments/:videoName", async (req, res) => {
  try {
    const videoName = req.params.videoName;
    const sentiment = req.query.sentiment;

    const video = await Video.findOne({ video_name: videoName });
    if (!video) {
      return res.status(404).json({ message: "Videoname not found" });
    }
    let filteredComments;
    if (sentiment === "positive") {
      filteredComments = video.comments.filter((comment) =>
        isPositive(comment)
      );
    } else if (sentiment === "negative") {
      filteredComments = video.comments.filter((comment) =>
        isNegative(comment)
      );
    } else {
      return res.status(400).json({ message: "Invalid sentiment parameter" });
    }
    res.render("comments", { filteredComments: filteredComments, videoName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Utility function to check if a comment is positive
function isPositive(comment) {
  const positiveKeywords = [
    "great",
    "amazing",
    "fantastic",
    "awesome",
    "excellent",
    "informative",
    "interesting",
    "delicious",
    "love",
    "thanks for sharing",
    "thanks",
    "entertaining",
    "beautiful",
    "soothing",
    "impressive",
    "mind blowing",
    "clear",
    "inspiring",
    "fabulous",
    "adorable",
    "relaxing",
  ];
  return positiveKeywords.some((keyword) =>
    comment.toLowerCase().includes(keyword)
  );
}

// Utility function to check if a comment is negative
function isNegative(comment) {
  const negativeKeywords = [
    "terrible",
    "awful",
    "horrible",
    "disappointing",
    "bad",
    "too basic",
    "not helpful",
    "too intense",
    "boring",
    "complicated",
    "lost",
    "too complex",
    "gross",
  ];
  return negativeKeywords.some((keyword) =>
    comment.toLowerCase().includes(keyword)
  );
}

// Routes for Subscription Details

router.get("/views/subscription", async (req, res) => {
  try {
    const videos = await Video.find(
      {},
      { video_name: 1, views: 1, subscription: 1 }
    ).sort({ views: -1 });
    // res.json({ videos });
    res.render("subscription", { videos: videos });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
