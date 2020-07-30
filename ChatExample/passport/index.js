var local_login = require("./local_login");
var local_signup = require("./local_signup");

module.exports = function(app, passport) {
  console.log("[ ] Passport setting called");

  passport.serializeUser(function(user, done) {
    console.log("[ ] serializeUser called : " + user.email);
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    console.log("[ ] deserializeUser called : " + email);
    var UserModel = app.get("database")["UserModel"];
    UserModel.findByEmail(email, function(err, users) {
      if (err) {
        done(err);
      }
      if ((users.length = 1)) {
        console.log("[ ] FOUND USER : " + users[0].email);
        done(null, users[0]);
      } else {
        console.log("[ ] deserializeUser error");
        done(null, false);
      }
    });
  });

  passport.use("local-login", local_login);
  passport.use("local-signup", local_signup);

  console.log("[+] Passport setting complete");
};
