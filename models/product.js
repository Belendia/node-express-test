const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(p, (error, content) => {
    if (error) {
      return callback([]);
    }
    return callback(JSON.parse(content));
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  static saveToFile(prod) {
    fs.writeFile(p, JSON.stringify(prod), (error) => {
      console.log(error);
    });
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // Add new product
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        Product.saveToFile(updatedProducts);
      } else {
        // Edit existing product
        this.id = Math.random().toString();
        products.push(this);
        Product.saveToFile(products);
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);

      fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
        if (!error) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callback) {
    return getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      callback(product);
    });
  }
};
