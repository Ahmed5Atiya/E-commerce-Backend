const express = require("express");
const {
  createSubCategory,
  getAllSubCategorys,
  getASingleSubCategory,
  deleteSubCategory,
  ubdateSubCategory,
} = require("../controller/subCategoryController");
const {
  createSubCategoryValidation,
  getSingleSubCategoryValidation,
  deleteSubCategoryValidation,
} = require("../validation/subCategoryValidation");

const router = express.Router();

router.post("/", createSubCategoryValidation, createSubCategory);
router.get("/", getAllSubCategorys);
router.get("/:id", getSingleSubCategoryValidation, getASingleSubCategory);
router.put("/:id", getSingleSubCategoryValidation, ubdateSubCategory);
router.delete("/:id", deleteSubCategoryValidation, deleteSubCategory);

module.exports = router;
