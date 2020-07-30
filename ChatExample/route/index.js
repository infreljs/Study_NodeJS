module.exports = function(router) {
  var config = require("../config");

  console.log("[ ] (route) Router init called");

  var routeLength = config.ROUTE_INFO.length;
  console.log("[ ] (route) Number of routes : %d", routeLength);

  for (var i = 0; i < routeLength; i++) {
    switch (config.ROUTE_INFO[i].type.toUpperCase()) {
      case "GET":
        router.get(
          config.ROUTE_INFO[i].path,
          require(config.ROUTE_INFO[i].file)[config.ROUTE_INFO[i].method]
        );
        break;
      case "POST":
        router.post(
          config.ROUTE_INFO[i].path,
          require(config.ROUTE_INFO[i].file)[config.ROUTE_INFO[i].method]
        );
        break;
      case "PUT":
        router.put(
          config.ROUTE_INFO[i].path,
          require(config.ROUTE_INFO[i].file)[config.ROUTE_INFO[i].method]
        );
        break;
      case "DELETE":
        router.delete(
          config.ROUTE_INFO[i].path,
          require(config.ROUTE_INFO[i].file)[config.ROUTE_INFO[i].method]
        );
        break;
      default:
        console.log(
          "[!] (route) Unexpected type on setting router : %s",
          require(config.ROUTE_INFO[i].file)[config.ROUTE_INFO[i].method]
        );
    }
  }
  console.log("[+] (route) Router setting complete");
  return router;
};
