var routerMethods = require("../methods.js");

var routes = require("../routes.js");
const  Controller  = require("../../controller/");
var dataRouter = {
  run(request, response) {
    routerMethods.post(request, response, routes.data.read, Controller.readDb);
    routerMethods.post(request, response, routes.data.create, Controller.createDb);
    routerMethods.delete( request,response,routes.data.delete, Controller.deleteDb);
    routerMethods.patch(request, response,routes.data.update, Controller.updateDb);
  },
};
module.exports = dataRouter;