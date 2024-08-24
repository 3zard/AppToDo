const { writeFile, getBody, handleNotFound } = require("../../utils/helper.js");
const { StatusCode, getStatusCondition } = require("../../constans/status.js");

async function getTaskList(request, response, userId) {
  try {
    const status = request.url.split("?status=")[1] || getStatusCondition.All;
    let requestBody;
    status === getStatusCondition.All
      ? (requestBody = { filter: { owner: userId } })
      : (requestBody = {
          filter: {
            completed: status === getStatusCondition.Done,
            owner: userId,
          },
        });
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
      return response.end(JSON.stringify({ error: "Task not found" }));
    }
    const data = await taskList.json();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  } catch (error) {
    handleNotFound(request, response);
  }
}

async function createTask(request, response, userId) {
  const body = JSON.parse(await getBody(request));
  const { name, completed } = body;
  if (!name || completed === null || completed === undefined) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid task data" }));
    return;
  }
  try {
    const taskListResponse = await fetch(`http://localhost:3001/task/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ record: { ...body, owner: userId } }),
    });
    if (!taskListResponse.ok) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Task not found" }));
      return;
    }
    const data = await taskListResponse.json();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data.id));
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function updateTask(request, response, userId) {
  const body = await getBody(request);
  if (!body) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid task data" }));
    return;
  }
  const { id, name, completed } = JSON.parse(body);
  try {
    const taskResponse = await fetch(`http://localhost:3001/task/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: { id: id, owner: userId } }),
    });
    if (!taskResponse.ok) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Task not found" }));
    }
    const taskResponseJson = await taskResponse.json();
    const newTask = {
      id: id.toString(),
      name: name || taskResponseJson[0].name,
      completed: completed || taskResponseJson[0].completed,
      owner: userId,
    };
    const updateResponse = await fetch(`http://localhost:3001/task/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ record: newTask }),
    });

    if (!updateResponse.ok) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Failed to update task" }));
    }
    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
    response.end();
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function deleteTask(request, response, userId) {
  const body = await getBody(request);
  const { id } = JSON.parse(body);
  try {
    const taskResponse = await fetch(`http://localhost:3001/task/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: { id, owner: userId } }),
    });

    if (!taskResponse.ok) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "text/plain",
      });
      return response.end("Task not found");
    }

    const deleteResponse = await fetch(`http://localhost:3001/task/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, owner: userId }),
    });

    if (!deleteResponse.ok) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Failed to delete task" }));
    }

    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end();
  } catch (error) {
    console.error("Error deleteing task:", error);
  }
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  updateTask,
};
