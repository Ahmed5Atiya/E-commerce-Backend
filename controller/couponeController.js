const asyncHandler = require("express-async-handler");
const couponeSchema = require("../model/coubone");
const ApiError = require("../utlis/globalError");

const addCoupone = asyncHandler(async (req, res, next) => {
  const Coupone = await couponeSchema.create(req.body);
  res
    .status(200)
    .json({ message: "coupone created successfully", coupon: Coupone });
});
const updateCoupone = asyncHandler(async (req, res, next) => {
  const Coupone = await couponeSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!Coupone) {
    return next(
      ApiError.create(404, "This Coupone is not available", "failed")
    ); // Corrected typo
  }
  res
    .status(200)
    .json({ message: "coupone updated successfully", coupon: Coupone });
});
const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponeSchema.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return next(
      ApiError.create(404, "This Coupone is not available", "failed")
    );
  } // Corrected typo
  res.status(200).json({ message: "coupone deleted successfully" });
});
const getCoupones = asyncHandler(async (req, res, next) => {
  const coupon = await couponeSchema.find();
  res.status(200).json({ coupons: coupon });
});
const getCoupone = asyncHandler(async (req, res, next) => {
  const coupon = await couponeSchema.findById(req.params.id);
  if (!coupon) {
    return next(
      ApiError.create(404, "This Coupone is not available", "failed")
    );
  }
  res.status(200).json({ coupons: coupon });
});
module.exports = {
  addCoupone,
  deleteCoupon,
  getCoupone,
  getCoupones,
  updateCoupone,
};
