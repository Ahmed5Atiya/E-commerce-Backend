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
const {
  getAllAddressesWishlist,
  addAddressesToUsert,
  deleteAddressesToUser,
} = require("../controller/addressesController");

const router = express.Router();

router.get("/", Portect, allowedTo("user"), getAllAddressesWishlist);
router.post("/", Portect, allowedTo("user"), addAddressesToUsert);
router.delete("/:addressId", Portect, allowedTo("user"), deleteAddressesToUser);

module.exports = router;
