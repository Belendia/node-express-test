const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    css: ["/css/forms.css", "/css/product.css"],
  });
};

exports.postAddProduct = (req, res) => {
  // products.push({ title: req.body.title });
  const product = new Product(req.body.title);
  product.save();

  res.redirect("/");
};

exports.getProducts = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      hasProducts: products.length > 0,
      pageTitle: "Shop",
      path: "/shop",
      activeShop: true,
      css: ["/css/product.css"],
    }); //it use shop.pug by default;
  });
};
