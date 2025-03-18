const express = require("express");
const { Portect, allowedTo } = require("../controller/aurhController");
const {
  getCoupones,
  getCoupone,
  addCoupone,
  updateCoupone,
  deleteCoupon,
} = require("../controller/couponeController");
const router = express.Router();
router.get("/", getCoupones);
router.get("/:id", getCoupone);
router.post("/", Portect, allowedTo("admin", "manager"), addCoupone);
router.put("/:id", Portect, allowedTo("admin", "manager"), updateCoupone);
router.delete("/:id", Portect, allowedTo("admin", "manager"), deleteCoupon);

module.exports = router;
