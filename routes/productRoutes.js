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
const { Portect, allowedTo } = require("../controller/aurhController");
const ReviewsRoute = require("./reviewRoute");

const router = express.Router();
router.use("/:productId/reviews", ReviewsRoute);
router.get("/", getProducts);
router.get("/:id", getProductValidation, getProduct);
router.post(
  "/",
  Portect,
  allowedTo("admin", "manager"),
  uploadFiles,
  processImage,
  createProductValidation,
  createProduct
);
router.put(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  uploadFiles,
  processImage,
  updateProductValidation,
  updateProduct
);
router.delete(
  "/:id",
  Portect,
  allowedTo("admin", "manager"),
  deleteProductValidation,
  deleteProduct
);

module.exports = router;
