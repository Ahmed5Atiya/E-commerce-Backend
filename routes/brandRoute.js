const express = require("express");
const {
  getAllBrands,
  getASingleBrand,
  addBrand,
  ubdateBrand,
  deleteBrand,
  uploadHandler,
  processImage,
} = require("../controller/brandController");
const {
  getBrandValidation,
  createBrandValidation,
  ubdateBrandValidations,
  deleteBrandValidation,
} = require("../validation/brandValidation");
const { Portect, allowedTo } = require("../controller/aurhController");

const router = express.Router();

router.get("/", getAllBrands);
router.get("/:id", getBrandValidation, getASingleBrand);
router.post(
  "/",
  Portect,
  allowedTo("admin", "manager"),
  uploadHandler,
  processImage,
  createBrandValidation,
  addBrand
);
router.put(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  uploadHandler,
  processImage,
  ubdateBrandValidations,
  ubdateBrand
);
router.delete(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  deleteBrandValidation,
  deleteBrand
);

module.exports = router;
