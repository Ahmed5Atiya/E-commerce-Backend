const { default: slugify } = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/globalError");
const BrandSchema = require("../model/brand");
const { uploadSingleImage } = require("../utlis/uploadSingleImage");
const sharp = require("sharp");
const uploadHandler = uploadSingleImage("image");
const processImage = async (req, res, next) => {
  const fileName = `brands-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(650, 650)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
};
const getAllBrands = asyncHandler(async (req, res) => {
  const query = req.query;
  const page = query.page * 1 || 1;
  const limit = query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brand = await BrandSchema.find({}).skip(skip).limit(limit);
  res.json({ result: brand.length, page, data: brand });
});
const getASingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await BrandSchema.findById({ _id: id });
  if (!brand) {
    const error = ApiError.create("this product id not found", 404, "Fail");
    return next(error);
  }
  res.json({ brand });
});
const addBrand = async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const brand = new BrandSchema(req.body);
  await brand.save();
  res.json({ brand });
};
const ubdateBrand = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const brand = await BrandSchema.findByIdAndUpdate(
    id,
    { name: name },
    { new: true }
  );
  if (!brand) {
    const error = ApiError.create(
      "this product id not found to delete it",
      404,
      "Fail"
    );
    return next(error);
  }
  res.json({ brand });
};

const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandSchema.findByIdAndDelete({
    _id: id,
  });
  if (!brand) {
    const error = ApiError.create("this product id not found", 404, "Fail");
    return next(error);
    // res.status(404).json({ message: "the prodict id not found " });
  }
  res.status(200).json({ message: "the Brand delete success" });
});
module.exports = {
  getAllBrands,
  getASingleBrand,
  ubdateBrand,
  addBrand,
  deleteBrand,
  processImage,
  uploadHandler,
};
