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

// this to get the params like id form the url  ex /:categoryId/subcategory returns categoryId
const router = express.Router({ mergeParams: true });
router.post("/", createSubCategoryValidation, createSubCategory);
router.get("/", getAllSubCategorys);
router.get("/:id", getSingleSubCategoryValidation, getASingleSubCategory);
router.put("/:id", getSingleSubCategoryValidation, ubdateSubCategory);
router.delete("/:id", deleteSubCategoryValidation, deleteSubCategory);

module.exports = router;
