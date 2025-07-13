const { check } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");

exports.createSubCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("the name is required")
    .isLength({ min: 2 })
    .withMessage("the min length is required 2 is minlength")
    .isLength({ max: 32 })
    .withMessage("the max length is required 32 is maxlength"),
  check("category")
    .notEmpty()
    .withMessage("the category is required")
    .isMongoId()
    .withMessage("invalid id for the category"),
  validationCategory,
];
exports.deleteSubCategoryValidation = [
  check("id")
    .notEmpty()
    .withMessage("the name is required")
    .isMongoId()
    .withMessage("inValid id for the category"),
  validationCategory,
];
exports.getSingleSubCategoryValidation = [
  check("id")
    .notEmpty()
    .withMessage("the name is required")
    .isMongoId()
    .withMessage("inValid id for the category"),
  validationCategory,
];
