var routerMethods = require("../methods.js");
const middleware = require("../../middleware/index.js");

var routes = require("../routes.js");
const { taskController } = require("../../controller/index.js");
const { handleNotFound } = require("../../utils.js");
var userRouter = {
  run(request, response) {
    routerMethods.get(request, response, routes.tasks.value, [
      taskController.getTaskList,
    ]);
    routerMethods.post(request, response, routes.tasks.value, [
      middleware.checkToken,
      taskController.createTask,
    ]);
    routerMethods.delete(
      request,
      response,
      routes.tasks.value,
      taskController.deleteTask,
      middleware.checkToken
    );
    routerMethods.patch(
      request,
      response,
      routes.tasks.value,
      taskController.updateTask,
      middleware.checkToken
    );
  },
};
module.exports = userRouter;
