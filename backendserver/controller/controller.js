const taskList = require("../data/data.json");
const fs = require("fs");
const { getBody, writeFile } = require("../utils.js");
const getTaskList = (request, res) => {
  const status = request.url.split("?status=")[1] || "all";
  let statusTaskList = [];
  if (status === "done") {
    statusTaskList = taskList.filter((item) => item.completed === true);
  } else if (status === "undone") {
    statusTaskList = taskList.filter((item) => item.completed === false);
  } else if (status === "all") {
    statusTaskList = taskList;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(statusTaskList));
};

async function createTask(request, response) {
  try {
    const body = await getBody(request);
    const { id, name, completed } = JSON.parse(body);
    if (id === undefined || name === undefined || completed === undefined) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("Bad requestuest");
    } else {
      let task = taskList.find((item) => item.id === id || item.name === name);
      if (task) {
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Bad requestuest , item is exited");
      } else {
        taskList.push(JSON.parse(body));
        writeFile("./data/data.json", JSON.stringify(taskList));
        response.writeHead(201, { "Content-Type": "text/plain" });
        response.end("Created");
      }
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}
module.exports = {
  createTask,
  getTaskList,
};
