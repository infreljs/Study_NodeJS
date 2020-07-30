var config = {
  PORT: 3000,
  DB_URL: "mongodb://localhost:27017/local",
  DB_SCHEMAS: [
    {
      file: "./user_schema",
      collection: "users",
      schemaName: "UserSchema",
      modelName: "UserModel"
    }
  ],
  // Routing Information [. = /route]
  ROUTE_INFO: [
    {
      file: "./user",
      path: "/signup",
      method: "signup",
      type: "POST"
    },
    {
      file: "./user",
      path: "/login",
      method: "login",
      type: "POST"
    },
    {
      file: "./user",
      path: "/logout",
      method: "logout",
      type: "GET"
    }
  ]
};

module.exports = config;
