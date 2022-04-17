const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// this route is reached using /admin/add-products GET request
router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getProducts);

// this route is reached using /admin/add-products POST request
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
