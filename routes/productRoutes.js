const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadFiles,
  processImage,
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
router.post(
  "/",
  uploadFiles,
  processImage,
  createProductValidation,
  createProduct
);
router.put(
  "/:id",
  uploadFiles,
  processImage,
  updateProductValidation,
  updateProduct
);
router.delete("/:id", deleteProductValidation, deleteProduct);

module.exports = router;
