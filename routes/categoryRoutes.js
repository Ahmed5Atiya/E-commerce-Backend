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
} = require("../validation/categoryValidation");
const router = express.Router();

router.get("/", getAllCategorys);
router.get("/:id", getCategoryValidation, getASingleCategory);
router.post("/", createCategoryValidation, addCategory);
router.put("/:id", ubdateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
