const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// this route is reached using /admin/add-products GET request
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/products", adminController.getProducts);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
