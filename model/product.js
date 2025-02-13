const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [2, "the min length for the title is 2"],
      maxLength: [200, "the min length for the title is 200"],
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minLength: [20, "the min length for the description is 20"],
      maxLength: [2000, "the max length for the description is 2000"],
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "the product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "the product price is required"],
      trim: true,
      minLength: [2, "the price for the product should be upper than 20"],
      maxLength: [
        200000,
        "the price for the product should be lower than 200000",
      ],
    },
    priceAfterDisc: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "the image should be provided"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "the category should be provided"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "the rating should be at least 1"],
      max: [5, "the rating should be at not more than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
