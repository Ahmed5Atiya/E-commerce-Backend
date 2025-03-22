const express = require("express");
const { Portect, allowedTo } = require("../controller/aurhController");
const {
  getCartForLoggedUser,
  addProductToCart,
  deleteCart,
  deleteProductFromCart,
  updateCartItemQuantity,
  applayCoupone,
} = require("../controller/cartController");

const router = express.Router();

router.get("/", Portect, allowedTo("user"), getCartForLoggedUser);
router.delete("/", Portect, allowedTo("user"), deleteCart);
router.post("/", Portect, allowedTo("user"), addProductToCart);
router.put("/applayCoupone", Portect, applayCoupone);
router.delete("/:itemId", Portect, allowedTo("user"), deleteProductFromCart);
router.put("/:productId", Portect, allowedTo("user"), updateCartItemQuantity);
module.exports = router;
