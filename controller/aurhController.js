const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");
var jwt = require("jsonwebtoken");

const SignUp = asyncHandler(async (req, res, next) => {
  // 1) create the user account
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //   2) create the token for this user
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  // 3) return the response with the token
  res.status(200).json({ user: user, token: token });
});

module.exports = {
  SignUp,
};
