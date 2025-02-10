const mongooes = require("mongooes");
const SubCategorySchemas = new mongooes.Schema(
  {
    title: {
      type: "string",
      trim: true,
      required: true,
      unique: [true, "subcategory must be specified"],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    category: {
      type: mongooes.Schema.ObjectId,
      ref: "Category",
      required: [true, "subcategory must be belong to this category perant"],
    },
  },
  { Timestamp: true }
);

module.exports = mongooes.model("SubCategory", SubCategorySchema);
