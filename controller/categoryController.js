const { default: slugify } = require("slugify");
const CategorySchema = require("../model/category");
const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/globalError");
const getAllCategorys = async (req, res) => {
  const product = await CategorySchema.find({});

  res.json({ product });
};
const getASingleCategory = async (req, res) => {
  const { id } = req.params;
  const product = await CategorySchema.findById({ _id: id });

  res.json({ product });
};
const addCategory = async (req, res) => {
  const { name } = req.body;
  const product = new CategorySchema({ name, slug: slugify(name) });
  await product.save();
  res.json({ product });
};
const ubdateCategory = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const product = await CategorySchema.findByIdAndUpdate(
    id,
    { name: name },
    { new: true }
  );
  res.json({ product });
};

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await CategorySchema.findByIdAndDelete({
    _id: id,
  });
  if (!product) {
    const error = ApiError.create("this product id not found", 404, "Fail");
    return next(error);
    // res.status(404).json({ message: "the prodict id not found " });
  }
  res.status(200).json({ message: "the category delete success" });
});
module.exports = {
  getAllCategorys,
  getASingleCategory,
  ubdateCategory,
  addCategory,
  deleteCategory,
};
