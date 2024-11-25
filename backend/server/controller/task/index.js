const { writeFile, getBody, handleNotFound } = require("../../utils/helper.js");
const { statusCode} = require("../../constant/status.js");
const {MongoClient, ObjectId} = require("mongodb");
const { url } = require("../../constant/status.js");
const client = new MongoClient(url.connectMongodb);

async function getTaskList(request, response, userId) {
  try {
    const query = { owner: userId };
    const database = client.db("todoapp");
    const tasks = database.collection("tasks");

    const task = await tasks.find(query).toArray();
    if (task) {
      response.writeHead(statusCode.OK, { "Content-Type": "application/json" });
      response.end(JSON.stringify(task));
      
    } else {
      response.writeHead(statusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Tasks not found" }));
    }
  } catch (error) {
    console.error("Error fetching task list:", error);
    response.writeHead(statusCode.INTERNAL_SERVER_ERROR, {
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
      response.writeHead(statusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Invalid task data" }));
    }

    try {
      const database = client.db("todoapp");
      const tasks = database.collection("tasks");
      await tasks.insertOne({
        name: name,
        completed: completed,
        owner: userId,
      });
    } catch (error) {
      console.log(error);
      response.writeHead(statusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      return response.end(JSON.stringify({ error: "Cannot create task" }));
    }
   
    response.writeHead(statusCode.CREATED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ message: "Task created" }));
  } catch (error) {
    console.error("Error creating task:", error);
    response.writeHead(statusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot create task" }));
  }
}

async function updateTask(request, response, userId) {
  try {
    const updateBody = JSON.parse(await getBody(request));
    const { id, name, completed } = updateBody;
    const database = client.db("todoapp");
    const taskCollection = database.collection("tasks");
    const existingTask = await taskCollection.findOne({
      _id: new ObjectId(id),
      owner: userId,
    });
    
    if (!existingTask) {
      response.writeHead(statusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Task not found" }));
      return;
    }
    const result = await taskCollection.updateOne(
      { _id: new ObjectId(id), owner: userId },
      { $set: { name: name || existingTask.name, completed: completed !== undefined ?  completed : existingTask.completed } }
    );

    if (result.matchedCount === 0) {
      response.writeHead(statusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Task not found" }));
    } else {
      response.writeHead(statusCode.NO_CONTENT, {
        "Content-Type": "application/json",
      });
      response.end();
    }
  } catch (error) {
    console.error("Error updating task:", error);
    response.writeHead(statusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot update task" }));
  } 
}

async function deleteTask(request, response, userId) {
  try {
    const body = JSON.parse(await getBody(request));
    const { id } = body;
    if (!id) {
      response.writeHead(statusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      return response.end(
        JSON.stringify({ error: "Missing taskId in request data." })
      );
    }
    
    const database = client.db("todoapp");
    const tasksCollection = database.collection("tasks");
    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id), "owner": userId
    });
    if (result.deletedCount === 1) {
      response.writeHead(statusCode.NO_CONTENT, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ message: "Task deleted successfully." }));
    } else {
      response.writeHead(statusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Task to delete not found." }));
    }
  } catch (error) {
    console.error("Error when deleting task:", error);
    response.writeHead(statusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        error: "A server error occurred while attempting to delete the task.",
      })
    );
  } 
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  updateTask,
};
