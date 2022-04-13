const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();

const products = [];

// this route is reached using /admin/add-products GET request
router.get("/add-product", (req, res, next) => {
  console.log("In another middleware");
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    css: ["/css/forms.css", "/css/product.css"],
  });
});

// this route is reached using /admin/add-products POST request
router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
