const mongoose = require("mongoose");

//videoschema

const videoSchema = new mongoose.Schema({
  user_id: String,
  video_id: String,
  video_category: String,
  video_name: String,
  views: Number,
  comments: [String],
  subscription: Number,
});

//user schema
const userSchema = new mongoose.Schema({
  username: String,
  userId: String,
  userType: String,
  email: String, // Change userEmail to email
  password: String, // Change userPassword to password
});

//schema model

const Video = mongoose.model("videos", videoSchema);
const User = mongoose.model("users", userSchema);

module.exports = {
  Video: Video,
  User: User,
};
