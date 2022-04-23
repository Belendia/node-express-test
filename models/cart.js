const fs = require("fs");
const path = require("path");
const { createBrotliCompress } = require("zlib");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, content) => {
      let cart = { products: [], totalPrice: 0 };
      // Fetch the privous cart
      if (!err) {
        cart = JSON.parse(content);
      }

      // Analyze the cart if we already added the product into the cart
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      // Add new product/ increase quantity
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // id is the product id that is currenly inserted into the cart.
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Save the cart to a file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, content) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(content) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      console.log(updatedCart.totalPrice);
      console.log(productPrice);
      console.log(productQty);

      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, content) => {
      const cart = JSON.parse(content);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
