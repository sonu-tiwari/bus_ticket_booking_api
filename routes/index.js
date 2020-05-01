const express = require("express");
const router = express.Router();
const apiRouter = require("./ticket.api.router");
router.use("/api", apiRouter);
router.get("/", (req, res) => {
  return res.sendFile("index.html");
});
router.all("/*", (req, res) => {
  res.status(404).send({
    status: 404,
    message: "URL you are looking is not found.",
  });
});
module.exports = router;
