const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const {
  getProductValidation,
  deleteProductValidation,
  updateProductValidation,
  createProductValidation,
} = require("../validation/product");

console.log(createProduct); // Should print the function definition

const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProductValidation, getProduct);
router.post("/", createProductValidation, createProduct);
router.put("/:id", updateProductValidation, updateProduct);
router.delete("/:id", deleteProductValidation, deleteProduct);

module.exports = router;
