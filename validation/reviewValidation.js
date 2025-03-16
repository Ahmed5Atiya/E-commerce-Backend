const { check } = require("express-validator");
const validationCategory = require("../middleware/validationMiddlerware");
const reviewSchema = require("../model/review");
const userModel = require("../model/user");

exports.createReviewValidation = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating must be specified")
    .isFloat({ min: 1, max: 5 })
    .withMessage("the rating must be between 0 and 5"),
  check("user")
    .isMongoId()
    .withMessage("the id must be valid for this user")
    .custom((value, { req }) =>
      userModel.findById(value).then((user) => {
        if (!user) {
          return Promise.reject(new Error("this user does not exist"));
        }
      })
    ),
  check("product")
    .isMongoId()
    .withMessage("the id must be valid for")
    .custom((value, { req }) =>
      reviewSchema
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("you aready reviewed this product")
            );
          }
        })
    ),
  validationCategory,
];
exports.ubdateReviewValidations = [
  check("id")
    .isMongoId()
    .withMessage("the  id is not valid")
    .custom((value, { req }) =>
      reviewSchema.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error("The id is not available for this review")
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you are not allowed to change the review")
          );
        }
      })
    ),
  validationCategory,
];

exports.getReviewValidation = [
  check("id").isMongoId().withMessage("invalid id for the product this id"),
  validationCategory,
];

exports.deleteReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("the id must be valid")
    .custom((value, { req }) => {
      if (req.user.role === "user") {
        return reviewSchema.findById(value).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error("The id is not available for this review")
            );
          }
          if (review.user.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("you are not allowed to delete the review")
            );
          }
        });
      }
      return true;
    }),
  validationCategory,
];
