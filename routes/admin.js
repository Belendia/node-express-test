const path = require("path");

const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

// this route is reached using /admin/add-products GET request
router.get("/add-product", productsController.getAddProduct);

// this route is reached using /admin/add-products POST request
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
