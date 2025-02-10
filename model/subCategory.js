const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "the name for category is require"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subcategory must be belong to this category perant"],
    },
  },
  { timestamps: true }
);
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;
