var mongoose = require("mongoose");
var { autoIncrement } = require("mongoose-plugin-autoinc");

var database = {};

database.init = function(app, config) {
  console.log("[ ] (database) Database init called");

  connect(app, config);
};

function connect(app, config) {
  var databaseUrl = config.DB_URL;

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);

  database.conn = mongoose.connection;

  database.conn.on(
    "error",
    console.error.bind(console, "[!] Mongoose connection error!")
  );
  database.conn.on("open", function() {
    console.log("[+] (database) Database connected : " + databaseUrl);
    createSchema(app, config);
  });
  database.conn.on("disconnected", function() {
    console.log(
      "[!] (database) Database disconnected. Trying to reconnect after 5 sec..."
    );
    setInterval(connect, 5000);
  });
}

function createSchema(app, config) {
  var schemaLength = config.DB_SCHEMAS.length;
  console.log("[ ] (database) Number of schemas : %d", schemaLength);

  for (var i = 0; i < schemaLength; i++) {
    var item = config.DB_SCHEMAS[i];

    var schema = require(item.file).createSchema(mongoose, autoIncrement);
    var model = mongoose.model(item.collection, schema);

    database[item.schemaName] = schema;
    database[item.modelName] = model;
    console.log(
      "[+] (database) Schema [%s], Model [%s] added",
      item.schemaName,
      item.modelName
    );
  }

  app.set("database", database);
  console.log("[+] (database) Database setting complete");
}

module.exports = database;
