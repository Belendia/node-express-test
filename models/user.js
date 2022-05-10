const mongodb = require("mongodb");
const getDb = require("../utils/db").getDb;

class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Create new product
      dbOp = db.collection("users").insertOne(this);
    }

    return dbOp;
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
