const { getTaskList, createTask } = require("../controller/controller.js");

const router = (request, response) => {
  switch (request.method) {
    case "GET":
      if (request.url.match(/\/tasks\?status=(done|undone)/) || request.url === "/tasks") {
        getTaskList(request, response);
      } else if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Main");
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
      }
      break;
    case "POST":
      if (request.url === "/tasks") {
         createTask(request, response);
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
      }
      break;
    case "DELETE":
      switch (request.url) {
        case "/tasks/:id":
          break;
        default:
          break;
      }
      break;
    case "PATCH":
      switch (request.url) {
        case "/tasks/:id":
          break;
        default:
          break;
      }
      break;
    default:
      response.writeHead(405, { "Content-Type": "text/plain" });
      response.end("Method Not Allowed");
  }
};

module.exports = { router };
