const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../model/product");
const ApiError = require("../utlis/globalError");
const { default: slugify } = require("slugify");

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
  // 1) create filter for products
  const queryStringObj = { ...req.query };
  const ExitQueryString = ["sort", "limit", "page", "fields"];
  ExitQueryString.forEach((field) => delete queryStringObj[field]);
  // applay the filter fot (gte , gt ,lte , le ) fot the porduct
  let QueryStr = JSON.stringify(queryStringObj);
  QueryStr = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Pagination the query string
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;

  // create the model instance
  let mongooeQuery = Product.find(JSON.parse(QueryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 3)  applay the sort for the product
  if (req.query.sort) {
    // to make the sort form query to be (price quantity) not (price,quentity)
    let sortBy = req.query.sort.split(",").join(" ");
    mongooeQuery = mongooeQuery.sort(sortBy);
  } else {
    mongooeQuery = mongooeQuery.sort("-createdAt");
  }

  // 4) applay the Fields limiting
  if (req.query.fields) {
    let fields = req.query.fields.split(",").join(" ");
    mongooeQuery = mongooeQuery.select(fields);
  } else {
    mongooeQuery = mongooeQuery.select("-__v");
  }

  // 5) applay for the search query
  // if (req.query.keyword) {
  //   console.log(req.query.keyword);
  //   let searchBy = {};
  //   searchBy.$or = [
  //     { title: { $regex: req.query.keyword, $options: "i" } },
  //     { description: { $regex: req.query.keyword, $options: "i" } },
  //   ];
  //   mongooeQuery = mongooeQuery.find(searchBy);
  // }
  // build the model object
  const products = await mongooeQuery;
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
