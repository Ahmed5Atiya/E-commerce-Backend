const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../model/product");
const ApiError = require("../utlis/globalError");
const { default: slugify } = require("slugify");

const createProduct = asyncHandler(async (req, res, next) => {
  const productData = req.body;

  const product = await Product.create({
    ...productData, // Spread the properties of productData here!
    slug: slugify(req.body.title),
  });

  res.status(200).json({ product: product });
});
const getProducts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
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
