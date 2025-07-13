const express = require("express");
const { Portect, allowedTo } = require("../controller/aurhController");
const {
  getAllReview,
  getReview,
  createReview,
  updateReview,
  getTheIdFromParams,
  deleteReview,
} = require("../controller/reviewsController");
const {
  createReviewValidation,
  ubdateReviewValidations,
  deleteReviewValidation,
} = require("../validation/reviewValidation");
const router = express.Router({ mergeParams: true });
// const router = express.Router();

router.get("/", getAllReview);
router.get("/:id", getReview);
router.post(
  "/",
  Portect,
  allowedTo("user"),
  createReviewValidation,
  createReview
);
router.put(
  "/:id",
  Portect,
  allowedTo("user"),
  ubdateReviewValidations,
  updateReview
);
router.delete(
  "/:id",
  Portect,
  allowedTo("admin", "manager", "user"),
  deleteReviewValidation,
  deleteReview
);

module.exports = router;
