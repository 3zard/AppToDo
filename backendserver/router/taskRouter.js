const controller = require("../controller/index.js");

module.exports = {
  GET: controller.tasks.getTaskList,
  POST: controller.tasks.createTask,
  PUT: controller.tasks.updateTask,
  DELETE: controller.tasks.deleteTask,
};
