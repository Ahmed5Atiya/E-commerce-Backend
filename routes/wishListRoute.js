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
  deleteLoggedUer,
} = require("../controller/userController");
const {
  createUserValidation,
  updateUserValidations,
  deleteUserValidation,
} = require("../validation/userValidation");
const { Portect, allowedTo } = require("../controller/aurhController");
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getAllProductWishlist,
} = require("../controller/wishListController");

const router = express.Router();

router.get("/", Portect, allowedTo("user"), getAllProductWishlist);
router.post("/", Portect, allowedTo("user"), addProductToWishlist);
router.delete(
  "/:productId",
  Portect,
  allowedTo("user"),
  deleteProductFromWishlist
);

module.exports = router;
