var LocalStrategy = require("passport-local").Strategy;
module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  function(req, email, password, done) {
    console.log(
      "[ ] (passport) Passport local-login called : " + email + ", " + password
    );

    var UserModel = req.app.get("database").UserModel;
    UserModel.findOne(
      {
        email: email
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("[ ] (passport) User not matched");
          return done(null, false, {
            loginMessage: "Incorrect Email"
          });
        }
        if (!user.authenticate(password, user.salt, user.hashed_password)) {
          console.log("[ ] (passport) User password is wrong");
          return done(null, false, {
            loginMessage: "Incorrect Password"
          });
        }
        console.log("[ ] (passport) Login Success");
        return done(null, user);
      }
    );
  }
);
