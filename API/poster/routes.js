const express = require("express"); //import express from express

const {
  posterFetch,
  updatePoster,
  deletePoster,
  fetchPoster,
} = require("./controllers");

const multer = require("multer");
const passport = require("passport");
const router = express.Router(); // import router method from express

//Parameter
router.param("posterId", async (req, res, next, posterId) => {
  const poster = await fetchPoster(posterId, next);
  if (poster) {
    req.poster = poster;
    next();
  } else {
    const error = new Error("Poster Not Found");
    error.status = 404;
    next(error);
  }
});

//multer
const storage = multer.diskStorage({
  destination: "./media", //path from app.js not from routes
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage });

//Fetch Route
router.get("/", posterFetch);

//Delete Route
router.delete(
  "/:posterId",
  passport.authenticate("jwt", { session: false }),
  deletePoster
);

//Update Route
router.put(
  "/:posterId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updatePoster
);

module.exports = router;
