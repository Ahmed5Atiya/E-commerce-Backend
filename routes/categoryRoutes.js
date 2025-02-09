// const { getAllCategorys } = require("../controller/category.controller");
// const express = require("express");
// const router = express.Router();

// router.get("/", getAllCategorys);

// module.exports = router;
const {
  getAllCategorys,
  getASingleCategory,
  addCategory,
  ubdateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const express = require("express");
const router = express.Router();

router.get("/", getAllCategorys);
router.get("/:id", getASingleCategory);
router.post("/", addCategory);
router.put("/:id", ubdateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
