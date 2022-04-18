const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageURL, description, price);
  product.save();

  res.redirect("/");
};

exports.postEditProduct = (req, res) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
};

exports.postDeleteProduct = (req, res) => {};

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      hasProducts: products.length > 0,
      pageTitle: "Admin products",
      path: "/admin/products",
    }); //it use shop.pug by default;
  });
};
