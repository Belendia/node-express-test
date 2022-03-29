const path = require("path");

const express = require("express");

const router = express.Router();

// this route is reached using /admin/add-products GET request
router.get("/add-product", (req, res, next) => {
  console.log("In another middleware");
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

// this route is reached using /admin/add-products POST request
router.post("/add-product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
