const { getTaskList, createTask } = require("../controller/controller.js");

const router = (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url.match(/\/tasks\?status=(done|undone)/)) {
        getTaskList(req, res);
      } else if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Main");
      } else if (req.url === "/tasks") {
        getTaskList(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      break;
    case "POST":
      if (req.url === "/tasks") {
        createTask(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      break;
    case "DELETE":
      switch (req.url) {
        case "/tasks/:id":
          break;
        default:
          break;
      }
      break;
    case "PATCH":
      switch (req.url) {
        case "/tasks/:id":
          break;
        default:
          break;
      }
      break;
    default:
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
  }
};

module.exports = { router };
