var LocalStrategy = require("passport-local").Strategy;
module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  function(req, email, password, done) {
    console.log(
      "[ ] (passport) Passport local-signup called : " + email + ", " + password
    );
    var name = req.body.name;
    var UserModel = req.app.get("database").UserModel;

    UserModel.findOne({ email: email }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        console.log("[ ] Email [%s] duplicated", email);
        return done(
          null,
          false,
          req.flash("signupMessage", "Email already used.")
        );
      } else {
        var user = new UserModel({
          email: email,
          password: password,
          name: name
        });
        user.save(function(err) {
          if (err) {
            return done(err);
          }
          console.log("[ ] (passport) User inserted");
          done(null, user);
        });
      }
    });
  }
);
