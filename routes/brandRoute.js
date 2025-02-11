const express = require("express");
const {
  getAllBrands,
  getASingleBrand,
  addBrand,
  ubdateBrand,
  deleteBrand,
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
router.post("/", createBrandValidation, addBrand);
router.put("/:id", ubdateBrandValidations, ubdateBrand);
router.delete("/:id", deleteBrandValidation, deleteBrand);

module.exports = router;
