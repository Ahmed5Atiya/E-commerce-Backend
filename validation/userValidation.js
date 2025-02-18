const { check, body } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");
const { default: slugify } = require("slugify");
const userModel = require("../model/user");
const bcrypt = require("bcryptjs");
exports.updateUserValidations = [
  check("id")
    .notEmpty()
    .withMessage("the id is required")
    .isMongoId()
    .withMessage("the  id is not valid"),
  validationCategory,
];

exports.getUserValidation = [
  check("id").isMongoId().withMessage("invalid id for the product this id"),
  validationCategory,
];

exports.createUserValidation = [
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

  check("phone")
    .notEmpty()
    .withMessage("Please enter your phone number")
    .isMobilePhone("ar-EG")
    .withMessage("your phone number not available for this region"),
  check("role").optional(),
  check("profileImage").optional(),
  validationCategory,
];
exports.updateUserPasswordValidation = [
  check("id")
    .notEmpty()
    .withMessage("the id is required")
    .isMongoId()
    .withMessage("the  id is not valid"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current Password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your password Confirm"),
  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Please enter your password at least 6 characters ")
    .custom(async (password, { req }) => {
      // 1) check if the current password is correct
      const user = await userModel.findById({ _id: req.params.id });
      if (!user) {
        throw new Error("user not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error(" incorrect current password");
      }
      // 2) check if the password and password confirm is matches
      if (password !== req.body.passwordConfirm) {
        throw new Error("the password and passwordConfirm fields do not match");
      }
      return true;
    }),

  validationCategory,
];

exports.deleteUserValidation = [
  check("id").isMongoId().withMessage("the id must be valid"),
  validationCategory,
];
