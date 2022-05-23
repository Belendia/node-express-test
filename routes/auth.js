const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid e-mail.")
      .normalizeEmail(), //normalize email will sanitize the email by making sure that all characters are small case and trim white spaces
    body(
      "password",
      "Password must be at lease 6 characters long and use alpha numeric characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(), // this function sanitize the password
  ],
  authController.postLogin
);
router.post("/logout", isAuth, authController.postLogout);
router.get("/signup", authController.getSignup);

// the check() function will check the reqest, body, head, cookie and so on.
// But if you want to check a specific area like body, or head or cookie,
// you can add those functions only
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid e-mail.")
      .normalizeEmail()
      .custom((value, { req }) => {
        // The custom validator returns true if the promiss resolves successfully.
        // If not, it will return false.
        return User.findOne({ email: value }).then((usr) => {
          if (usr) {
            return Promise.reject(
              "E-mail exists already, please pick a different one."
            );
          }
        });
      }),
    // We add the error message to the body as a second argument because it serves both/all validator functions.
    // withMessage() function however will only display an error message for only one validator function. i.e. isLength ...
    body(
      "password",
      "Please enter a password with only numbers and text and at lease 6 characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
