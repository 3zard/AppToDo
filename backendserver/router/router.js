const {
  getTaskList,
  createTask,
  deleteTask,
  handleNotFound,
  updateTask,
} = require("../controller/tasks/index.js");
const url = require("url");
const routes = {
  "/tasks": {
    GET: { controller: getTaskList },
    POST: { controller: createTask },
    DELETE: { controller: deleteTask },
    PATCH: { controller: updateTask },
  },
};

function route(request) {
  const { method, url: requestUrl } = request;
  const pathUrl = url.parse(requestUrl, true);
  const { pathname } = pathUrl;
  if (routes[pathname] && routes[pathname][method]) {
    return routes[pathname][method].controller;
  }
  return handleNotFound;
}
module.exports = { route };
