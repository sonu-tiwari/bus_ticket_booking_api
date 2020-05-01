const express = require("express");
const apiRoutes = require("./routes/index");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", apiRoutes);
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error: ", err);
  } else {
    console.log("Node Server running on PORT: ", process.env.PORT);
  }
});

module.exports = app; // For testing.
