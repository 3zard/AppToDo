const routerMethods = require("./methods.js");
const routes = require("./routes.js");
const controller = require("../controller/index.js");

var router = {
  run: function (request, response) {
    routerMethods.post(request, response, routes.collection.read, controller.readDataBase);
    routerMethods.post(request, response, routes.collection.create, controller.createDatabase);
    routerMethods.patch(request, response, routes.collection.update, controller.updateDatabase);
    routerMethods.delete(request, response, routes.collection.delete, controller.deleteDatabase);
  },
};

module.exports = router;
