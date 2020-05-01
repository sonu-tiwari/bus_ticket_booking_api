const mongoose = require("mongoose");
require("dotenv/config");
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection
  .once("open", () => console.log("Connected to the DB successfully"))
  .on("error", (error) => {
    console.warn("Warning", error);
  });
module.exports = mongoose.connection;
