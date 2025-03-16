const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../model/product");
const ApiError = require("../utlis/globalError");
const { default: slugify } = require("slugify");
const ApiFeature = require("../utlis/ApiFeatures");
const reviewSchema = require("../model/review");

const getTheIdFromParams = asyncHandler(async (req, res, next) => {
  console.log(req.params.productId);
  if (req.params.productId) req.body.product = req.params.productId;
  next();
});
const createReview = asyncHandler(async (req, res, next) => {
  const review = await reviewSchema.create(req.body);
  // Send response
  res.status(201).json({ review });
});
const getAllReview = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = query.page * 1 || 1;
  const limit = query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  let filterByCategory = {};
  if (req.params.productId) {
    filterByCategory = { product: req.params.productId }; // Use 'category', not 'categoryId'
  }
  const Review = await reviewSchema
    .find(filterByCategory)
    .skip(skip)
    .limit(limit);
  res.json({ result: Review.length, page, data: Review });
});

const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Review = await reviewSchema.findById({ _id: id });
  if (!Review) {
    return next(ApiError.create(404, "Review not found", "faild"));
  }
  res.status(200).json({ data: Review });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Review = await reviewSchema.findByIdAndDelete({ _id: id });
  if (!Review) {
    return next(ApiError.create(404, "Review not found", "faild"));
  }

  res.status(200).json({ msg: "Review delete success" });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Get ID from req.params, not req.body
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updatedProduct = await reviewSchema.findByIdAndUpdate(
    id,
    { $set: req.body }, // Use $set to update specific fields
    { new: true }
  );

  if (!updatedProduct) {
    return next(ApiError.create(404, "This Review is not available", "failed")); // Corrected typo
  }

  res.status(200).json({ data: updatedProduct });
});

module.exports = {
  createReview,
  getReview,
  getAllReview,
  deleteReview,
  updateReview,
  getTheIdFromParams,
};
