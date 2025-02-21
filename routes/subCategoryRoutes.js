const express = require("express");
const {
  createSubCategory,
  getAllSubCategorys,
  getASingleSubCategory,
  deleteSubCategory,
  ubdateSubCategory,
  setCategoryIdTobody,
} = require("../controller/subCategoryController");
const {
  createSubCategoryValidation,
  getSingleSubCategoryValidation,
  deleteSubCategoryValidation,
} = require("../validation/subCategoryValidation");
const { Portect, allowedTo } = require("../controller/aurhController");

// this to get the params like id form the url  ex /:categoryId/subcategory returns categoryId
const router = express.Router({ mergeParams: true });
router.post(
  "/",
  Portect,
  allowedTo("admin", "manager"),
  setCategoryIdTobody,
  createSubCategoryValidation,
  createSubCategory
);
router.get("/", getAllSubCategorys);
router.get("/:id", getSingleSubCategoryValidation, getASingleSubCategory);
router.put(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  getSingleSubCategoryValidation,
  ubdateSubCategory
);
router.delete(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  deleteSubCategoryValidation,
  deleteSubCategory
);

module.exports = router;
