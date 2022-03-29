const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("In the middleware");
  next(); //Allows the request to continue to the next middleware in line
});

// the route can also be registed as a middleware
app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);
