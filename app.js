const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//middleware
app.use(bodyParser.urlencoded());

app.use((req, res, next) => {
  console.log("In the middleware");
  next(); //Allows the request to continue to the next middleware in line
});

app.get("/add-product", (req, res, next) => {
  console.log("In another middleware");
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  );
});

app.post("/product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h>");
});

app.listen(3000);
