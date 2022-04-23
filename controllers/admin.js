const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageURL, description, price);
  product.save();

  res.redirect("/");
};

exports.postEditProduct = (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id, title, imageURL, description, price);
  product.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id);
  res.redirect("/admin/products");
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
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
