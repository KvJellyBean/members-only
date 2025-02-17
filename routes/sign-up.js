const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { addUser, validateSignUp, renderSignUp } = require("../controllers/controller");

router.get("/", renderSignUp);

router.post(
  "/",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  validateSignUp,
  addUser
);

module.exports = router;
