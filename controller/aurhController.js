const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const userModel = require("../model/user");
var jwt = require("jsonwebtoken");
const ApiError = require("../utlis/globalError");
const bcrypt = require("bcryptjs");
const { sendTheEmail } = require("../utlis/sendEmail");

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
      ApiError.create("invalid user email or password", 404, "failed")
    ); // Corrected typo
  }
  //   2) create the token for the user
  const token = generateToken(user._id);
  // 3) return the response with the token
  res.status(200).json({ user: user, token: token });
});
const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) check if the user with this email has already existed
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    const error = ApiError.create("User does not exist", 401, "faild");
    return next(error);
  }

  // 2) if the user is existing create the 6 randomly number and hash the resetCode and save it in the db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // here hash the resetCode using the crypto
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save the hashing the  resetCode  in the db
  user.passwordResetCode = hashResetCode;
  // make password reset code expiration to be valid for 10 minutes
  user.passwordExpirationCode = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerifid = false;
  await user.save();

  // send the code to email
  const message = `Hi  ${user.name} , \n we send  your reset code form E-commerce website reset cose is \n ${resetCode} \n please enter your reset code in website`;
  try {
    await sendTheEmail({
      email: user.email,
      subject: "your resetCode are valid for 10 minutes ",
      message: message,
    });
  } catch (err) {
    user.passwordResetVerifid = undefined;
    user.passwordResetCode = undefined; //
    user.passwordExpirationCode = undefined; //

    await user.save();
    const error = ApiError.create(
      "ther is error happen in sending email",
      401,
      "faild"
    );
    return next(error);
  }

  res.status(201).json({ message: " your resetCode send successfully" });
});

const verifyResetCode = asyncHandler(async (req, res, next) => {
  console.log(req.body.resetCode);
  const code = req.body.resetCode;
  const hashResetCode = crypto.createHash("sha256").update(code).digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashResetCode,
  });

  if (!user) {
    const error = ApiError.create(
      "this user or reset code not exists",
      401,
      "faild"
    );
    return next(error);
  }
  if (user.passwordExpirationCode < Date.now()) {
    const error = ApiError.create("this resetCode is expired ", 401, "faild");
    return next(error);
  }
  user.passwordResetVerifid = true;
  await user.save();
  // const token = generateToken(user._id);
  res.status(200).json({ success: "success submit resetCode" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    const error = ApiError.create("User does not exist", 401, "faild");
    return next(error);
  }
  if (!user.passwordResetVerifid) {
    const error = ApiError.create("the reset Code not Verifid", 401, "faild");
    return next(error);
  }

  user.password = req.body.newPassword;
  user.passwordExpirationCode = undefined;
  user.passwordResetVerifid = undefined;
  user.passwordResetCode = undefined;
  await user.save();
  const token = generateToken(user._id);

  res.status(200).json({ message: "password reset successful", token: token });
});
const Portect = asyncHandler(async (req, res, next) => {
  // 1) check if the token is existing
  let token;
  if (
    req.headers.authorization &&
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
  // 2) verify token to check if no changes happened (expired tokens , no changes happened)
  let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if this user aready existing
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    const error = ApiError.create("this user is not existing", 400, "fail");
    return next(error);
  }
  // 4) check if the user changed their password after creating the token
  if (currentUser.passwordChangeAt) {
    // convert the passwordChangeAt from data to timestamp
    const passwordChangeAtTimeStamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    // check if the user changed their password after the login
    if (passwordChangeAtTimeStamp > decoded.iat) {
      const error = ApiError.create(
        "the password are changed please login again",
        400,
        "error"
      );
      return next(error);
    }
  }

  req.user = currentUser;
  // req.id = currentUser._id;
  next();
});

// ...values mean make convert ("admin" , "manger") to ["admin", "manger"]
const allowedTo = (...values) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user.role;
    if (!values.includes(user)) {
      const error = ApiError.create("You are not allowed", 404, "Fail");
      return next(error);
    }
    next();
  });
module.exports = {
  SignUp,
  Login,
  Portect,
  allowedTo,
  forgetPassword,
  verifyResetCode,
  resetPassword,
};
