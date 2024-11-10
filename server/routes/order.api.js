const express = require("express");
const authController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.post("/", authController.authenticate, orderController.createOrder);
router.get("/", authController.authenticate, orderController.getOrderList);
router.get("/me", authController.authenticate, orderController.getOrder);
router.put(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.updateOrder
);
router.delete(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  orderController.deleteOrder
);

module.exports = router;
