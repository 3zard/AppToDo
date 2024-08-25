const { writeFile, getBody, handleNotFound } = require("../../utils/helper.js");
const { StatusCode, getStatusCondition } = require("../../constant/status.js");

async function getTaskList(request, response, userId) {
  try {
    const status = request.url.split("?status=")[1];
    let requestBody;

    if (status) {
      requestBody = {
        filter: {
          completed: status === getStatusCondition.Done,
          owner: userId,
        },
      };
    } else {
      requestBody = { filter: { owner: userId } };
    }

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
      return response.end(JSON.stringify({ error: "Tasks not found" }));
    }

    const data = await taskList.json();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching task list:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Failed to fetch task list" }));
  }
}

async function createTask(request, response, userId) {
  try {
    const body = JSON.parse(await getBody(request));
    const { name, completed } = body;

    if (!name || completed === null || completed === undefined) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Invalid task data" }));
    }

    const taskResponse = await fetch(`http://localhost:3001/task/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ record: { ...body, owner: userId } }),
    });

    if (!taskResponse.ok) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Task creation failed" }));
    }

    const data = await taskResponse.json();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data.id));
  } catch (error) {
    console.error("Error creating task:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot create task" }));
  }
}

async function updateTask(request, response, userId) {
  try {
    const body = await getBody(request);
    if (!body) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "No body" }));
    }

    const { id, name, completed } = JSON.parse(body);

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
      completed:
        completed === undefined ? taskResponseJson[0].completed : completed,
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
    console.error("Error updating task:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot update task" }));
  }
}

async function deleteTask(request, response, userId) {
  try {
    const body = await getBody(request);
    if (!body) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "No body" }));
    }

    const { id } = JSON.parse(body);
    if (!id) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(
        JSON.stringify({ error: "Missing 'id' in the request body" })
      );
    }

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

    const deleteResponse = await fetch(`http://localhost:3001/task/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ record: { id: id } }),
    });

    if (!deleteResponse.ok) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Failed to delete task" }));
    }

    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
    response.end();
  } catch (error) {
    console.error("Error deleting task:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot delete task" }));
  }
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  updateTask,
};
