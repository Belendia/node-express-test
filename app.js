const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("In the middleware");
  next(); //Allows the request to continue to the next middleware in line
});

// the route can also be registed as a middleware
app.use("/admin", adminData.routes);
app.use(shopRoutes);

//catch all middleware for 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
