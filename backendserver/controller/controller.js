const taskList = require("../data/data.json");
const fs = require("fs");
const { getBody, writeFile, readFile } = require("../utils.js");

const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

function getTaskList(request, response) {
  const status = request.url.split("?status=")[1] || "all";
  let statusTaskList = [];
  if (status === "done") {
    statusTaskList = taskList.filter((item) => item.completed === true);
  } else if (status === "undone") {
    statusTaskList = taskList.filter((item) => item.completed === false);
  } else if (status === "all") {
    statusTaskList = taskList;
  }
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.end(JSON.stringify(statusTaskList));
};

async function createTask(request, response) {
  try {
    const body = await getBody(request);
    const { id, name, completed } = JSON.parse(body);
    if (id === undefined || name === undefined || completed === undefined) {
      response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
      response.end("Bad request");
    } else {
      let task = taskList.find((item) => item.id === id || item.name === name);
      if (task) {
        response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
        response.end("Bad request");
      } else {
        taskList.push(JSON.parse(body));
        writeFile("./data/data.json", JSON.stringify(taskList));
        response.writeHead(StatusCode.CREATED, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ id: id }));
      } 
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}

function deleteTask(request, response) {
  const taskId = request.url.split("?id=")[1];
  fs.readFile("./data/data.json", 'utf8', (error, data) => {
    if (error) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
      response.end("Cannot read data");
      return;
    }
    let currentTasks = JSON.parse(data);
    const newTasks = currentTasks.filter(task => task.id.toString() !== taskId)
    if (currentTasks.length === newTasks.length) {
        handleNotFound(request, response);
        return;
    }
    writeFile("./data/data.json", JSON.stringify(newTasks))
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" })
    response.end(`Task with ID ${taskId} has been deleted successfully.`);
  })
}

function handleNotFound (request, response) {
  response.writeHead(StatusCode.NOT_FOUND, { "Content-Type": "text/plain" });
  response.end("Not Found");
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  handleNotFound
};
