const { body, validationResult } = require("express-validator");
const {
  getAllCategorys,
  getASingleCategory,
  addCategory,
  ubdateCategory,
  deleteCategory,
  uploadHandler,
  processImage,
} = require("../controller/categoryController");
const express = require("express");
const validationCategory = require("../middleware/validationMiddlerware");
const {
  getCategory,
  getCategoryValidation,
  createCategoryValidation,
  ubdateCategoryValidation,
  deleteCategoryValidation,
} = require("../validation/categoryValidation");
const subCategoryRouter = require("../routes/subCategoryRoutes");
const { Portect, allowedTo } = require("../controller/aurhController");
const router = express.Router();
router.use("/:categoryId/subcategory", subCategoryRouter);
router.get("/", getAllCategorys);
router.get("/:id", getCategoryValidation, getASingleCategory);
router.post(
  "/",
  Portect,
  allowedTo("admin", "manager"),
  uploadHandler,
  processImage,
  createCategoryValidation,
  addCategory
);
router.put(
  "/:id",
  uploadHandler,
  processImage,
  ubdateCategoryValidation,
  ubdateCategory
);
router.delete("/:id", deleteCategoryValidation, deleteCategory);

module.exports = router;
