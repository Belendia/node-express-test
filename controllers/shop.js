const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res) => {
  // the + is to type cast page from string to integer
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE || 2;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        hasProducts: products.length > 0,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // the + is to type cast page from string to integer
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE || 2;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        hasProducts: products.length > 0,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.product")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.prodId;
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.product")
    .then((user) => {
      console.log(user);
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.product._doc } };
      });

      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }

      // check to see if the orderId belongs to the currently logged in user.
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // This technique will preload the entire file into memory before sending it to users.
      // This technique is problematic if the file size is too large.
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err); // the default error handling function takeover.
      //   }

      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   ); // make the browser open the file inline

      //   res.send(data);
      // });

      // The best and recommended solution is to stream the data instead of reading the entire data to memory.
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceName + '"'
      // ); // make the browser open the file inline

      // file.pipe(res);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      ); // make the browser open the file inline
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      let totalPrice = 0;
      pdfDoc.fontSize(14).text("------------------");
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.text(
          prod.product.title +
            " - " +
            prod.quantity +
            " x $" +
            prod.product.price
        );
      });
      pdfDoc.text("-----");
      pdfDoc.fontSize(18).text("Total Price: $" + totalPrice);

      pdfDoc.end(); //Done writing the PDF
    })
    .catch((err) => next(err));
};
