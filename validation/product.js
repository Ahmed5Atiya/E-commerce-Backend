const { check } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");
const CategorySchema = require("../model/category");
const ApiError = require("../utlis/globalError");
const SubCategory = require("../model/subCategory");

exports.createProductValidation = [
  check("title")
    .notEmpty()
    .withMessage("title must be Provided")
    .isLength({ min: 2 })
    .withMessage("title must be not small then 2 char ")
    .isLength({ max: 200 })
    .withMessage("title must be not larger then 200 char "),
  check("description")
    .notEmpty()
    .withMessage("description must be Provided")
    .isLength({ min: 20 })
    .withMessage("desc must be not small then 20 char ")
    .isLength({ max: 2000 })
    .withMessage("desc must be not larger then 2000 char "),
  check("quantity")
    .notEmpty()
    .withMessage("quantity must be Provided")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("price must be Provided")
    .isNumeric()
    .withMessage("price must be a number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("price disc must be a number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("price after decound must be lower than price ");
      }
      return value;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("the colors must be arrays of string"),
  check("images")
    .optional()
    .isArray()
    .withMessage("the images must be arrays of string"),
  check("imageCover")
    .notEmpty()
    .withMessage("imageCover must be a  provided string"),
  check("category")
    .notEmpty()
    .withMessage("category must be provided ")
    .isMongoId()
    .withMessage("category must be valid it ")
    .custom(async (value, { req, next }) => {
      const category = await CategorySchema.findById({
        _id: req.body.category,
      });
      if (!category) {
        throw new Error(`Category no found for ${req.body.category}`);
      }
      return category;
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("category must be valid it ")
    .custom((subCategores) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategores } }).then(
        (result) => {
          console.log(result);
          if (result.length !== subCategores.length || result.length < 1) {
            return Promise.reject(
              new Error("this sub category id not found in sub categories")
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("category must be valid it "),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("the ratingsQuantity must be an numerical   ")
    .isLength({ min: 1 })
    .withMessage("the ratingsAverage must be above or equal to 1")
    .isLength({ max: 5 })
    .withMessage("the ratingsAverage must be lower or equal to 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("the ratingsQuantity must be an numerical   "),
  validationCategory,
];

exports.deleteProductValidation = [
  check("id").isMongoId().withMessage("the id should be valid"),
  validationCategory,
];
exports.updateProductValidation = [
  check("id").isMongoId().withMessage("the id should be valid"),
  validationCategory,
];
exports.getProductValidation = [
  check("id").isMongoId().withMessage("the id should be valid"),
  validationCategory,
];
