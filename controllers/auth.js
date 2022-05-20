const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

exports.getLogin = (req, res, next) => {
  // 'error' is the key we used down in postLogin function line 24
  // The error message is stored in the session and will be removed once it is shown.
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  return res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",

    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  // this is used for setting a cookie
  // req.setHeader("Set-Cookie", "loggedIn=true");

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      // if we can't find the user by email, redirect to login page
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          if (passwordMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // res.redirect("/");

            // We don't usually need to explicitly call save() method
            // but we wanted to make sure that we are redirecting after
            // the session is stored to the mongodb database which will
            // take few milliseconds. Some times the redirect will occure
            // before the session is stored.
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          // valid email but wrong password
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
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
        req.flash(
          "error",
          "E-mail exists already, please pick a different one."
        );
        return res.redirect("/signup");
      }

      // hash the password before storing it
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          // after successfully creating the user, redirect to login page to authenticate the user
          res.redirect("/login");

          return transporter.sendMail({
            from: "pomi144@gmail.com",
            to: email,
            subject: "Signup succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        });
    })
    .catch((err) => console.log(err));
};
