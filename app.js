const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

// tell express that we are going to use a templating engine
app.set("view engine", "pug");
/**
 * The below line5 is not necessary since the default views directory is views and
 * I am using views to store the templates. But if I use a different
 * name for the views folder for example, templates then I can set it for
 * the views key like
 * app.set('views', 'views');
 **/
app.set("views", "views");

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
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404");
});

app.listen(3000);
