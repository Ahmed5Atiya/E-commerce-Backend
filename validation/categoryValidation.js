const { check } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");

exports.getCategoryValidation = [
  check("id").isMongoId().withMessage("invalid id for the product this id"),
  validationCategory,
];

exports.createCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("the name is require")
    .isLength({ min: 6, max: 32 })
    .withMessage("the name for category should by min 6 char"),
  validationCategory,
];

exports.ubdateCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("the name is require")
    .isLength({ min: 6, max: 32 })
    .withMessage("the name for category should by min 6 char"),
  check("id").isMongoId().withMessage("the id should be valid "),
  validationCategory,
];

exports.deleteCategoryValidation = [
  check("id").isMongoId().withMessage("the id should be valid"),
  validationCategory,
];
