const mongoose = require("mongoose");
const { getReview } = require("../controller/reviewsController");
const Product = require("./product");
const reviwoModel = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "the minimum number of stars is  1.0"],
      max: [5, "the maximum number of stars is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "reviews must be provided"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "reviews must be provided"],
    },
  },
  { timestamps: true }
);

reviwoModel.pre("find", function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviwoModel.statics.calcAverageratingAndQuntity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviwoModel.post("save", async function (req, res) {
  await this.constructor.calcAverageratingAndQuntity(this.product);
});
// reviwoModel.post("remove", async function (req, res) {
//   await this.constructor.calcAverageratingAndQuntity(this.product);
// });
reviwoModel.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageratingAndQuntity(doc.product);
  }
});
const reviewSchema = mongoose.model("Review", reviwoModel); //
module.exports = reviewSchema;
