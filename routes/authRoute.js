const express = require("express");
const { SignUp } = require("../controller/aurhController");

const { SignUpValidation } = require("../validation/authValidation");

const router = express.Router();

// router.get("/", getUsers);
router.post("/signup", SignUpValidation, SignUp);
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
