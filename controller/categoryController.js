const { default: slugify } = require("slugify");
const CategorySchema = require("../model/category");
const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/globalError");
const ApiFeature = require("../utlis/ApiFeatures");
const sharp = require("sharp");
// how to upload files
const multer = require("multer");
// const DiskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categores");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `categores-${Date.now()}.${ext}`;
//     console.log(fileName);
//     cb(null, fileName);
//   },
// });
const multerStorage = multer.memoryStorage();
const filterFile = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(ApiError.create("allowed  for only images ", 400, "fail"), false);
  }
};
const processImage = async (req, res, next) => {
  console.log(req.file);
  const fileName = `categores-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(650, 650)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/categores/${fileName}`);
  req.body.image = fileName;
  next();
};
const upload = multer({ storage: multerStorage, fileFilter: filterFile });
const uploadHandler = upload.single("image");
const getAllCategorys = async (req, res) => {
  // const query = req.query;
  // const page = query.page * 1 || 1;
  // const limit = query.limit * 1 || 5;
  // const skip = (page - 1) * limit;
  let numberProfuct = await CategorySchema.countDocuments();
  const apiFeatures = new ApiFeature(CategorySchema.find(), req.query)
    .sort()
    .filter()
    .pagination(numberProfuct)
    .Limitfields();
  let { paginationResult, mongooseQuery } = apiFeatures;
  const product = await mongooseQuery;

  res.json({ result: product.length, paginationResult, data: product });
};
const getASingleCategory = async (req, res) => {
  const { id } = req.params;
  const product = await CategorySchema.findById({ _id: id });

  res.json({ product });
};
const addCategory = async (req, res) => {
  // const { name } = req.body;
  req.body.slug = slugify(req.body.name);
  const product = new CategorySchema(req.body);
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
  uploadHandler,
  processImage,
};
