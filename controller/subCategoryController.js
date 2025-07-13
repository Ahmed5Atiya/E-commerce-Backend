const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/subCategory");
const ApiError = require("../utlis/globalError");

const { default: slugify } = require("slugify");

const setCategoryIdTobody = (req, res, next) => {
  if (req.params.categoryId) req.body.category = req.params.categoryId;
  next();
};
const createSubCategory = asyncHandler(async (req, res) => {
  //   if (req.params.categoryId) req.category = req.params.categoryId;
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
  const limit = query.limit * 1 || 15;
  const skip = (page - 1) * limit;
  let filterByCategory = {};
  if (req.params.categoryId) {
    filterByCategory = { category: req.params.categoryId }; // Use 'category', not 'categoryId'
  }
  const subcategories = await SubCategory.find(filterByCategory) // Apply the filter here!
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res.json({ result: subcategories.length, page, data: subcategories });
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
  setCategoryIdTobody,
};
