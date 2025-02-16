const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [2, "the min length for the title is 2"],
      maxLength: [200, "the max length for the title is 200"],
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
      max: [200000, "the price for the product should be lower than 200000"],
    },
    priceAfterDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message:
          "the discounted price should be less than or equal to the original price",
      },
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
      max: [5, "the rating should be not more than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesArray = [];
    doc.images.map((img) => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      imagesArray.push(imageUrl);
    });
    doc.images = imagesArray;
  }
};
productSchema.post("init", (doc) => {
  ImageUrl(doc);
});

productSchema.post("save", (doc) => {
  ImageUrl(doc);
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
