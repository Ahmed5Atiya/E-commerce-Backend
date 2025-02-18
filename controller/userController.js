const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");
const ApiFeature = require("../utlis/ApiFeatures");
const sharp = require("sharp");
const { uploadSingleImage } = require("../utlis/uploadSingleImage");

const processImage = async (req, res, next) => {
  const fileName = `users-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(650, 650)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${fileName}`);
    req.body.profileImage = fileName;
  }

  next();
};
// const upload = multer({ storage: multerStorage, fileFilter: filterFile });
const uploadHandler = uploadSingleImage("profileImage");

const createUser = asyncHandler(async (req, res, next) => {
  const user = new userModel(req.body);
  await user.save();
  res.status(200).json({ user: user });
});

const getUsers = asyncHandler(async (req, res, next) => {
  const numberUser = await userModel.countDocuments();
  const apiFeatures = new ApiFeature(userModel.find(), req.query)
    .sort()
    .pagination(numberUser)
    .Limitfields()
    .filter();
  let { mongooseQuery, paginationResult } = apiFeatures;
  const users = await mongooseQuery;
  res.status(200).json({ paginationResult: paginationResult, users: users });
});

const getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById({ _id: id });
  if (!user) {
    const error = ApiError.create("this user id not found", 404, "Fail");
    return next(error);
  }
  res.status(200).json({ user: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const newUser = await userModel.findByIdAndUpdate(
    id,
    { $set: req.body }, // Use $set to update specific fields
    { new: true }
  );
  if (!newUser) {
    const error = ApiError.create("this user id not found", 404, "Fail");
    return next(error);
  }

  res.status(200).json({ user: newUser });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    const error = ApiError.create("this user id not found", 404, "Fail");
    return next(error);
  }
  res.status(200).json({ msg: "this user has been deleted" });
});
module.exports = {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadHandler,
  processImage,
};
