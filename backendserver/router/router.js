const {
  getTaskList,
  createTask,
  deleteTask,
  handleNotFound,
} = require("../controller/controller.js");
const url = require("url");
const routes = {
  "/tasks": { 
    "GET": { controller: getTaskList }, 
    "POST": { controller: createTask },
    "DELETE": { controller: deleteTask}
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
