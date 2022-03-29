const express = require("express");

const router = express.Router();

// this route is reached using /admin/add-products GET request
router.get("/add-product", (req, res, next) => {
  console.log("In another middleware");
  res.send(
    '<form action="/admin/add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  );
});

// this route is reached using /admin/add-products POST request
router.post("/add-product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
