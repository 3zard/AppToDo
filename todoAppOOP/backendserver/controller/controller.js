const taskList = require("../data/data.json");
const fs = require("fs");
const getTaskList = (req, res) => {
  const status = req.url.split("?status=")[1];
  let statusTaskList = [];
  if (status === "done") {
    statusTaskList = taskList.filter((item) => item.completed === true);
  } else if (status === "undone") {
    statusTaskList = taskList.filter((item) => item.completed === false);
  } else {
    statusTaskList = taskList;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(statusTaskList));
};

const createTask = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const { id, name, completed } = JSON.parse(body);
    if (id === undefined || name === undefined || completed === undefined) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
    } else {
      let task = taskList.find((item) => item.id === id && item.name === name);
      if (task) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request , item is exited");
      } else {
        taskList.push(JSON.parse(body));

        fs.writeFile("./data/data.json", JSON.stringify(taskList), (err) => {
          if (err) throw err;
        });
        res.writeHead(201, { "Content-Type": "text/plain" });
        res.end("Created");
      }
    }
  });
};
module.exports = {
  createTask,
  getTaskList,
};
