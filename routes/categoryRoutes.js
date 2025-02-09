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
const router = express.Router();

router.get("/", getAllCategorys);
router.get(
  "/:id",
  body("id").isMongoId().withMessage("invalid id for the product this id"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  },
  getASingleCategory
);
router.post("/", addCategory);
router.put("/:id", ubdateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
