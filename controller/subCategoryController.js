const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/subCategory");
const ApiError = require("../utlis/globalError");

const { default: slugify } = require("slugify");
const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const newSubCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(200).json({ data: newSubCategory });
});
const getAllSubCategorys = async (req, res) => {
  const query = req.query;
  const page = query.page * 1 || 1;
  const limit = query.limit * 1 || 3;
  const skip = (page - 1) * limit;
  const product = await SubCategory.find({}).skip(skip).limit(limit);

  res.json({ result: product.length, page, data: product });
};
const getASingleSubCategory = async (req, res) => {
  const { id } = req.params;
  const product = await SubCategory.findById({ _id: id });
  if (!product) {
    const error = ApiError.create(
      "this product for this id not found",
      404,
      "faild"
    );
    return error;
  }
  res.json({ product });
};

const ubdateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const newCategory = await SubCategory.findByIdAndUpdate(
    id,
    {
      name,
      category,
      slug: slugify(name),
    },
    { new: true }
  );
  if (!newCategory) {
    const error = ApiError.create("this subCategory id not found", 404, "Fail");
    return next(error);
  }
  res.status(200).json({ newCategory: newCategory });
};
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await SubCategory.findByIdAndDelete({
    _id: id,
  });
  if (!product) {
    const error = ApiError.create("this product id not found", 404, "Fail");
    return next(error);
  }
  res.status(200).json({ message: "the category delete success" });
});
module.exports = {
  createSubCategory,
  getAllSubCategorys,
  getASingleSubCategory,
  deleteSubCategory,
  ubdateSubCategory,
};
