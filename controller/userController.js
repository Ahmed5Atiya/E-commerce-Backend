const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");
const ApiError = require("../utlis/globalError");
const sharp = require("sharp");
const { uploadSingleImage } = require("../utlis/uploadSingleImage");
const bcrypt = require("bcryptjs");
const ApiFeature = require("../utlis/ApiFeatures");
const { generateToken } = require("../utlis/generateToken");

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
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      profileImage: req.body.profileImage,
      phone: req.body.phone,
    }, // Use $set to update specific fields
    { new: true }
  );
  if (!newUser) {
    const error = ApiError.create("this user id not found", 404, "Fail");
    return next(error);
  }

  res.status(200).json({ user: newUser });
});
const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const newUser = await userModel.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    }, // Use $set to update specific fields
    // { $set: req.body }, // Use $set to update specific fields
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

const getLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) {
    const error = ApiError.create("this user  not found", 404, "Fail");
    return next(error);
  }
  res.status(200).json({ user: user });
});
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    }, // Use $set to update specific fields
    // { $set: req.body }, // Use $set to update specific fields
    { new: true }
  );

  if (!user) {
    const error = ApiError.create("this user id not found", 404, "Fail");
    return next(error);
  }

  // generate a new token for the user
  const token = generateToken(user._id);
  res.status(200).json({ user: user, token: token });
});
const updateLoggedUser = asyncHandler(async (req, res, next) => {
  const updateUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    }, // Use $set to update specific fields
    { new: true }
  );
  res.status(200).json({ user: updateUser });
});

const deleteLoggedUer = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({ message: " successfully Deactive user" });
});
module.exports = {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadHandler,
  processImage,
  updateUserPassword,
  getLoggedInUser,
  updateLoggedUserPassword,
  updateLoggedUser,
  deleteLoggedUer,
};
