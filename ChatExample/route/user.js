var passport = require("passport");

module.exports = {
  signup: passport.authenticate("local-signup", {
    successRedirect: "/home.html",
    failureRedirect: "/signup.html",
    failureFlash: true
  }),
  login: passport.authenticate("local-login", {
    successRedirect: "/home.html",
    failureRedirect: "/login.html",
    failureFlash: true
  }),
  logout: function(req, res) {
    console.log("[ ] /logout called");
    req.logout();
    res.redirect("/login.html");
  }
};
