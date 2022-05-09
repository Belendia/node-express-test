const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, description, imageURL);
  product
    .save()
    .then((result) => {
      console.log("Created the product successfully!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getProducts = (req, res, next) => {
  //{ where: { userId: req.user.id } }
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      hasProducts: products.length > 0,
      pageTitle: "Admin products",
      path: "/admin/products",
    }); //it use shop.pug by default;
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;

  Product.findById(productId).then((product) => {
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

exports.postEditProduct = (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, description, imageURL, id);

  product
    .save()
    .then((result) => {
      console.log("Updated Products");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id)
    .then((result) => {
      console.log("Destroyed the product!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
