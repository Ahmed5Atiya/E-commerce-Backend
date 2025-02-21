const express = require("express");
const {
  SignUp,
  Login,
  forgetPassword,
} = require("../controller/aurhController");

const {
  SignUpValidation,
  LoginValidation,
} = require("../validation/authValidation");

const router = express.Router();

// router.get("/", getUsers);
router.post("/signup", SignUpValidation, SignUp);
router.post("/login", LoginValidation, Login);
router.post("/forgetPassword", forgetPassword);
// router.put(
//   "/:id",
//   uploadHandler,
//   processImage,
//   updateUserValidations,
//   updateUser
// );
// router.put(
//   "/changePassword/:id",
//   updateUserPasswordValidation,
//   updateUserPassword
// );
// router.delete("/:id", deleteUserValidation, deleteUser);
// router.get("/:id", getUserValidation, getSingleUser);

module.exports = router;
