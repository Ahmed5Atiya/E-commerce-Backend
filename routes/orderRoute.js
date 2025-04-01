const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  checkoutPayment,
} = require("../controller/orderController");
const { Portect, allowedTo } = require("../controller/aurhController");

const router = express.Router();

router.post("/:cartId", Portect, allowedTo("user"), createCashOrder);
router.get("/:id", Portect, getOrder);
router.post(
  "/checkout_section/:cartId",
  Portect,
  allowedTo("user"),
  checkoutPayment
);
router.put(
  "/:id/deliver",
  Portect,
  allowedTo("admin", "manager"),
  updateOrderToDeliverd
);
router.put(
  "/:id/pay",
  Portect,
  allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.get("/", Portect, allowedTo("user", "admin", "manager"), getAllOrders);
module.exports = router;
