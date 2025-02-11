const mongoose = require("mongoose");

const BrandModel = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "the name for Brand is require"],
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const BrandSchema = mongoose.model("Brand", BrandModel); // Fixed typo
module.exports = BrandSchema;
