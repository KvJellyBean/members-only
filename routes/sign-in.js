const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { validateSignIn, renderSignIn } = require("../controllers/controller");
const { body } = require("express-validator");

router.get("/", renderSignIn);

router.post(
  "/",
  body("email").isEmail().withMessage("Please enter a valid email address."),
  validateSignIn,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })
);

module.exports = router;
