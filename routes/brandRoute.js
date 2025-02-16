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

const router = express.Router();

router.get("/", getAllBrands);
router.get("/:id", getBrandValidation, getASingleBrand);
router.post("/", uploadHandler, processImage, createBrandValidation, addBrand);
router.put(
  "/:id",
  uploadHandler,
  processImage,
  ubdateBrandValidations,
  ubdateBrand
);
router.delete("/:id", deleteBrandValidation, deleteBrand);

module.exports = router;
