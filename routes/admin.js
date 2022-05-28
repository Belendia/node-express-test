const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
// this route is reached using /admin/add-products GET request
router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    // body("imageURL").trim().isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postAddProduct
);
router.get("/products", isAuth, adminController.getProducts);
router.post(
  "/edit-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    // body("imageURL").trim().isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postEditProduct
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
