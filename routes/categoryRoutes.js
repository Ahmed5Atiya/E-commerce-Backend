// const { getAllCategorys } = require("../controller/category.controller");
// const express = require("express");
// const router = express.Router();

// router.get("/", getAllCategorys);

// module.exports = router;
const { body, validationResult } = require("express-validator");
const {
  getAllCategorys,
  getASingleCategory,
  addCategory,
  ubdateCategory,
  deleteCategory,
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
const router = express.Router();
router.use("/:categoryId/subcategory", subCategoryRouter);
router.get("/", getAllCategorys);
router.get("/:id", getCategoryValidation, getASingleCategory);
router.post("/", createCategoryValidation, addCategory);
router.put("/:id", ubdateCategoryValidation, ubdateCategory);
router.delete("/:id", deleteCategoryValidation, deleteCategory);

module.exports = router;
