const taskList = require("../../data/data.json");
const { StatusCode, writeFile, getBody, getStatusCondition } = require("../../utils.js");
const fs = require("fs");

function getTaskList(request, response, user) {
  const status = request.url.split("?status=")[1] || "all";
  const myTask = taskList.filter((task) => task.owner === user);
  let statusTaskList = [];
  if (status === getStatusCondition.Done) {
    statusTaskList = myTask.filter((item) => item.completed === true);
  } else if (status === getStatusCondition.Undone) {
    statusTaskList = myTask.filter((item) => item.completed === false);
  } else if (status === getStatusCondition.All) {
    statusTaskList = myTask;
  }
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.end(JSON.stringify(statusTaskList));
}

async function createTask(request, response, user) {
  try {
    const body = await getBody(request);
    if (body) {
      const { name, completed } = JSON.parse(body);
      if (name === undefined || completed === undefined) {
        response.writeHead(StatusCode.BAD_REQUEST, {
          "Content-Type": "text/plain",
        });
        response.end("Bad request");
      } else {
        let task = taskList.find((item) => item.name === name);
        if (task) {
          response.writeHead(StatusCode.BAD_REQUEST, {
            "Content-Type": "text/plain",
          });
          response.end("Bad request");
        } else {
          let newTask = {
            id: taskList.length + 1,
            name: name,
            completed: completed,
            owner: user,
          };
          taskList.push(newTask);
          writeFile("./data/data.json", JSON.stringify(taskList));
          response.writeHead(StatusCode.CREATED, {
            "Content-Type": "application/json",
          });
          response.end(JSON.stringify(newTask));
        }
      }
    } else {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      response.end("No body");
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}

async function updateTask(request, response) {
  try {
    const idFromUrl = request.url.split("?id=")[1];
    const body = await getBody(request);
    const { name, completed } = JSON.parse(body);
    let newTask = taskList.find((item) => item.id === Number(idFromUrl));
    if (newTask) {
      newTask.name = name || newTask.name;
      if (completed !== undefined) {
        newTask.completed = completed;
      }
      writeFile("./data/data.json", JSON.stringify(taskList));
      response.writeHead(StatusCode.NO_CONTENT, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ newTask }));
    } else {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      response.end("Bad requestuest");
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}

function deleteTask(request, response) {
  const taskId = request.url.split("?id=")[1];
  fs.readFile("./data/data.json", "utf8", (error, data) => {
    if (error) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      response.end("Cannot read data");
      return;
    }
    let currentTasks = JSON.parse(data);
    const newTasks = currentTasks.filter(
      (task) => task.id.toString() !== taskId
    );
    if (currentTasks.length === newTasks.length) {
      handleNotFound(request, response);
      return;
    }
    writeFile("./data/data.json", JSON.stringify(newTasks));
    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
  });
}

function handleNotFound(request, response) {
  response.writeHead(StatusCode.NOT_FOUND, { "Content-Type": "text/plain" });
  response.end("Not Found");
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  handleNotFound,
  updateTask,
};
