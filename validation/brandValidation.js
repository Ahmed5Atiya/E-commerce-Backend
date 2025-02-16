const { check } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");

exports.ubdateBrandValidations = [
  check("id")
    .notEmpty()
    .withMessage("the id is required")
    .isMongoId()
    .withMessage("the  id is not valid"),
  validationCategory,
];

exports.getBrandValidation = [
  check("id").isMongoId().withMessage("invalid id for the product this id"),
  validationCategory,
];

exports.createBrandValidation = [
  check("name")
    .notEmpty()
    .withMessage("the name is required")
    .isLength({ min: 2 })
    .withMessage("the minimum char for brand is 2 ")
    .isLength({ max: 32 })
    .withMessage("the maximum char for brand is"),
  validationCategory,
];

exports.deleteBrandValidation = [
  check("id").isMongoId().withMessage("the id must be valid"),
  validationCategory,
];
