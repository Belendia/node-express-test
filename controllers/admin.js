const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  Product.create({
    title: title,
    imageURL: imageURL,
    price: price,
    description: description,
    userId: req.user.id,
  })
    .then((result) => {
      console.log("Created the product successfully!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  // const product = new Product(null, title, imageURL, description, price);
  // product
  //   .save()
  //   .then(() => res.redirect("/"))
  //   .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  // const product = new Product(id, title, imageURL, description, price);
  // product.save();
  Product.findByPk(id)
    .then((product) => {
      product.title = title;
      product.imageURL = imageURL;
      product.price = price;
      product.description = description;

      return product.save();
    })
    .then((result) => {
      console.log("Updated Products");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Destroyed the product!");
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

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findByPk(productId).then((product) => {
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
  Product.findAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      hasProducts: products.length > 0,
      pageTitle: "Admin products",
      path: "/admin/products",
    }); //it use shop.pug by default;
  });
};
