const routerMethods = require("../methods");
const routes = require("../routes.js");

const { userController } = require("../../controller");

const authentication = {
  run(request, response) {
    routerMethods.post(request, response, routes.user.login, [
      userController.login,
    ]);
    routerMethods.post(request, response, routes.user.register, [
      userController.register,
    ]);
  },
};

module.exports = authentication;
