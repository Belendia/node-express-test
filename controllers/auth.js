const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  return res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn === true,
  });
};

exports.postLogin = (req, res, next) => {
  // this is used for setting a cookie
  // req.setHeader("Set-Cookie", "loggedIn=true");

  // session
  User.findById("6280cff33a57280da29738e4")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // res.redirect("/");

      // We don't usually need to explicitly call save() method
      // but we wanted to make sure that we are redirecting after
      // the session is stored to the mongodb database which will
      // take few milliseconds. Some times the redirect will occure
      // before the session is stored.
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((usr) => {
      if (usr) {
        // TODO: show error message to the user that the
        // email address alredy exists.
        return res.redirect("/signup");
      }

      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      // after successfully creating the user, redirect to login page to authenticate the user
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
