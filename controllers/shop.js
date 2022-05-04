const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       hasProducts: rows.length > 0,
  //       pageTitle: "All products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        hasProducts: products.length > 0,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((error) => console.log(error));

  // alternatively we can use findAll with where clause
  // Product.findAll({
  //   where: {
  //     id: productId,
  //   },
  // })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       pageTitle: product[0].title,
  //       product: product[0],
  //       path: "/products",
  //     });
  //   })
  //   .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        hasProducts: products.length > 0,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  console.log(productId);
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findById(prodId, (product) => {
    if (product) {
      Cart.deleteProduct(prodId, product.price);
    }

    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
