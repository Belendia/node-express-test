const products = [];

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    css: ["/css/forms.css", "/css/product.css"],
  });
};

exports.postAddProduct = (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  res.render("shop", {
    prods: products,
    hasProducts: products.length > 0,
    pageTitle: "Shop",
    path: "/shop",
    activeShop: true,
    css: ["/css/product.css"],
  }); //it use shop.pug by default;
};
