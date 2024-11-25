const routerMethods = require("../methods.js");
const middleware = require("../../middleware/index.js");

const routes = require("../routes.js");
const { taskController } = require("../../controller/index.js");
const userRouter = {
  run(request, response) {
    routerMethods.get(request, response, routes.tasks.value, [
      middleware.checkToken,
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
      [middleware.checkToken, taskController.deleteTask]
    );
    routerMethods.patch(
      request,
      response,
      routes.tasks.value,
      [middleware.checkToken, taskController.updateTask]
    );
  },
};
module.exports = userRouter;
