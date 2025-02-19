const { check, body } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");
const { default: slugify } = require("slugify");
const userModel = require("../model/user");
const bcrypt = require("bcryptjs");

exports.SignUpValidation = [
  check("name")
    .notEmpty()
    .withMessage("the name is required")
    .isLength({ min: 2 })
    .withMessage("the minimum char for User is 2 ")
    .isLength({ max: 32 })
    .withMessage("the maximum char for User is"),
  body("name").custom((value, { req }) => {
    if (value) {
      req.body.slug = slugify(value, { lower: true }); // Convert to lowercase and slugify
    }
    return true; // Always return true to pass validation
  }),
  check("email")
    .notEmpty()
    .withMessage(" email is required")
    .isEmail()
    .withMessage("Please enter a valid email address ")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("the email address are already is used")
          );
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Please enter your password at least 6 characters ")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("the password and passwordConfirm fields do not match");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your passwordConfirm"),

  validationCategory,
];
