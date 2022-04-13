const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res) => {
  const products = adminData.products;
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/shop" }); //it use shop.pug by default;
});

module.exports = router;
