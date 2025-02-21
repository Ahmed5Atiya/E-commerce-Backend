const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");
var jwt = require("jsonwebtoken");
const ApiError = require("../utlis/globalError");
const bcrypt = require("bcryptjs");

const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};
const SignUp = asyncHandler(async (req, res, next) => {
  // 1) create the user account
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //   2) create the token for this user
  //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
  //     expiresIn: "1d",
  //   });
  const token = generateToken(user._id);
  // 3) return the response with the token
  res.status(200).json({ user: user, token: token });
});

const Login = asyncHandler(async (req, res, next) => {
  // 1) check if the email is correct and exists
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(
      ApiError.create(404, "This product is not available", "failed")
    ); // Corrected typo
  }
  //   2) create the token for the user
  const token = generateToken(user._id);
  // 3) return the response with the token
  res.status(200).json({ user: user, token: token });
});

const Portect = asyncHandler(async (req, res, error) => {
  // 1) check if the token is existing
  let token;
  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    const error = ApiError.create(
      "Invalid authorization should be provided",
      401,
      "fail"
    );
    return next(error);
  }

  // 2) verify token to check if no changes happened (expired tokens)
});
module.exports = {
  SignUp,
  Login,
};
