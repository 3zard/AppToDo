var routerMethods = require("../methods");
var routes = require("../routes.js");

const { userController } = require("../../controller");

var authentication = {
  run(request, response) {
    routerMethods.post(request, response, routes.user.value, [userController.login]);
    handleNotFound(request, response)
  },
};

module.exports = authentication;