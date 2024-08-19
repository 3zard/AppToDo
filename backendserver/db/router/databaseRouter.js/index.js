var routerMethods = require("../methods.js");

var routes = require("../routes.js");
const { userController } = require("../../controller/");
var dataRouter = {
  run(request, response) {
    routerMethods.get(request, response, routes.data.get, [userController.readDb]);
    routerMethods.post(request, response, routes.data.post, [userController.createDb]);
    routerMethods.delete( request,response,routes.data.delete, [userController.deleteDb]);
    routerMethods.patch(request, response,routes.data.patch, [userController.updateDb]);
  },
};
module.exports = dataRouter;