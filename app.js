const express = require("express");
const mongooseConnection = require("./model/db");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const videosRoutes = require("./routes/videosRoutes");

app.use(express.json());

app.use(
  cors({
    origin: "https:localhost:3000",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https:localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

app.use(bodyParser.json());
app.use(express.static("views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/videos", videosRoutes);

const PORT = process.env.PORT || 5000;
mongooseConnection.once("open", () => {
  // Wait for the mongoose connection to open
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
