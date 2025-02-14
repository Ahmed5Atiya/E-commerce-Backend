const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../model/product");
const ApiError = require("../utlis/globalError");
const { default: slugify } = require("slugify");
const ApiFeature = require("../utlis/ApiFeatures");
const createProduct = asyncHandler(async (req, res, next) => {
  const productData = req.body;
  // Generate slug if not provided
  if (!productData.slug) {
    productData.slug = slugify(productData.title, {
      lower: true,
      strict: true,
    });
  }
  const product = await Product.create(productData);
  // Send response
  res.status(201).json({ product });
});

const getProducts = asyncHandler(async (req, res, next) => {
  // create the model instance
  let apiFeatures = new ApiFeature(Product.find(), req.query)
    .sort()
    .pagination()
    .Limitfields()
    .filter();
  const products = await apiFeatures.mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });
  res.status(200).json({ results: products.length, data: products });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id });
  if (!product) {
    return next(ApiError.create(404, "Product not found", "faild"));
  }
  res.status(200).json({ data: product });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete({ _id: id });
  if (!product) {
    return next(ApiError.create(404, "Product not found", "faild"));
  }

  res.status(200).json({ msg: "product delete success" });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Get ID from req.params, not req.body
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: req.body }, // Use $set to update specific fields
    { new: true }
  );

  if (!updatedProduct) {
    return next(
      ApiError.create(404, "This product is not available", "failed")
    ); // Corrected typo
  }

  res.status(200).json({ data: updatedProduct });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
