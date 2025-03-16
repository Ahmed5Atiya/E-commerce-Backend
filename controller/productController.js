const express = require("express");
const asyncHandler = require("express-async-handler");
const Product = require("../model/product");
const ApiError = require("../utlis/globalError");
const { default: slugify } = require("slugify");
const ApiFeature = require("../utlis/ApiFeatures");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
const FilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(ApiError.create("allowd only for the image ", 400, fail), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: FilterImage });
const uploadFiles = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
const processImage = async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Date.now()}-imageCover.jpeg`;
    // this is for single image files imageCover
    await sharp(req.files.imageCover[0].buffer)
      .resize(900, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    // this to await the function to finish processing
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${Date.now()}-images-${index + 1}.jpeg`;
        // this is for array of  images files for images
        await sharp(img.buffer)
          .resize(900, 800)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
};
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
  let numberProfuct = await Product.countDocuments();
  let apiFeatures = new ApiFeature(Product.find(), req.query)
    .sort()
    .pagination(numberProfuct)
    .Limitfields()
    .filter();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });
  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let model = Product.findById({ _id: id }).populate({
    path: "reviews",
  });
  let product = await model;
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
  uploadFiles,
  processImage,
};
