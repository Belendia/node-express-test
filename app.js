const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
// const { engine } = require("express-handlebars");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const db = require("./utils/db");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

// Tell express that we want to use handlebars as a templating engine
// The first param can be named anything.
// The second parameter is the function we imported above to initialize handlebars templating engine.
// app.engine(
//   "hbs",
//   engine({
//     extname: "hbs",
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//   })
// );

// Set ejs as a templating engine
app.set("view engine", "ejs");
// The second parameter that you set here should match with the first parameter
// you set in the above code i.e. handlebars
// app.set("view engine", "hbs");

// Tell express that we are going to use a templating engine
// app.set("view engine", "pug");
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

// Register a new middleware to make the user available in the request so we can use the user anywhere.
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

// the route can also be registed as a middleware
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//catch all middleware for 404
app.use(errorController.get404);

// Create relationship
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);

// The sync() function will look all the models that we define using sequelize
// and creates tables and relations in the database.
// { force: true } will make sure to drop the tables first before creating them. Please
// don't use this in production settings.
db.sync()
  // .sync({ force: true })
  .then((result) => {
    //we temporarily create a user but we first need to check if a user exists
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    // we either return a new user by first creating it or the user we fetched in the first then block above
    if (!user) {
      return User.create({ name: "Belendia", email: "test@gmail.com" });
    }
    return user; // if you return anything in the then block, it will be wrapped into promise
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
