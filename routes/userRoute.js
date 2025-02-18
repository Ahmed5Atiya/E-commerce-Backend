const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
  uploadHandler,
  processImage,
} = require("../controller/userController");
const {
  createUserValidation,
  updateUserValidations,
  deleteUserValidation,
  getUserValidation,
} = require("../validation/userValidation");

const router = express.Router();

router.get("/", getUsers);
router.post("/", uploadHandler, processImage, createUserValidation, createUser);
router.put(
  "/:id",
  uploadHandler,
  processImage,
  updateUserValidations,
  updateUser
);
router.delete("/:id", deleteUserValidation, deleteUser);
router.get("/:id", getUserValidation, getSingleUser);

module.exports = router;
