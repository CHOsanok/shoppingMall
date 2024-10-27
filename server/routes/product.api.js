const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.conrtoller");

router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  productController.createProduct
);

module.exports = router;
