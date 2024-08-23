const {
  StatusCode,
  writeFile,
  getBody,
  getStatusCondition,
  handleNotFound
} = require("../../utils.js");

async function getTaskList(request, response) {
  try {
    const status = request.url.split("?status=")[1] || "all";
    let requestBody;
    status === "all"
      ? (requestBody = {})
      : (requestBody = { filter: { completed: status === "done" } });
    const taskList = await fetch(`http://localhost:3001/task/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!taskList.ok) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Task not found" }));
      return;
    }
    const data = await taskList.json();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  } catch (error) {
    handleNotFound(request, response);
  }
}

async function createTask(request, response, user) {
  try {
    
  } catch (error) {
    
  }
}

async function updateTask(request, response) {
  
}

function deleteTask(request, response) {
  
}



module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  updateTask,
};
