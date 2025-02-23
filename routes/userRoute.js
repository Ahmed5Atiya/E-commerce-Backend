const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
  uploadHandler,
  processImage,
  updateUserPassword,
  getLoggedInUser,
  updateLoggedUserPassword,
  updateLoggedUser,
} = require("../controller/userController");
const {
  createUserValidation,
  updateUserValidations,
  deleteUserValidation,
  getUserValidation,
  updateUserPasswordValidation,
  updateLoggedUserPasswordValidation,
  updateLoggedUserDataValidation,
} = require("../validation/userValidation");
const { Portect, allowedTo } = require("../controller/aurhController");

const router = express.Router();

router.get("/", getUsers);
router.get("/getMe", Portect, getLoggedInUser);
router.put(
  "/updateMe",
  Portect,
  updateLoggedUserDataValidation,
  updateLoggedUser
);
router.put(
  "/updateLoggedUserPassword",
  Portect,
  updateLoggedUserPasswordValidation,
  updateLoggedUserPassword
);
router.post(
  "/",
  Portect,
  allowedTo("admin", "manager"),
  uploadHandler,
  processImage,
  createUserValidation,
  createUser
);
router.put(
  "/:id",
  Portect,
  uploadHandler,
  processImage,
  updateUserValidations,
  updateUser
);
router.put(
  "/changePassword/:id",
  Portect,
  allowedTo("admin", "manager"),
  updateUserPasswordValidation,
  updateUserPassword
);
router.delete(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  deleteUserValidation,
  deleteUser
);
router.get("/:id", getUserValidation, getSingleUser);

module.exports = router;
