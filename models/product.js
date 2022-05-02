// const db = require("../utils/db");

// const Cart = require("./cart");

// module.exports = class Product {
//   constructor(id, title, imageURL, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageURL = imageURL;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO product (title, price, imageURL, description) VALUES (?, ?, ?, ?)",
//       [this.title, this.price, this.imageURL, this.description]
//     );
//   }

//   static deleteById(id) {}

//   static fetchAll() {
//     return db.execute(`SELECT * FROM product`);
//   }

//   static findById(id) {
//     return db.execute(`SELECT * FROM product WHERE id = ?`, [id]);
//   }
// };

const Sequelize = require("sequelize");

const db = require("../utils/db");

const Product = db.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.STRING,
});

module.exports = Product;
