const { check, body } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");
const { default: slugify } = require("slugify");

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
  validationCategory,
];

exports.deleteUserValidation = [
  check("id").isMongoId().withMessage("the id must be valid"),
  validationCategory,
];
