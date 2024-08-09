const taskList = require("../data/data.json");
const fs = require("fs");
const { getBody } = require("../utils.js");
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

// const createTask = (request, res) => {
//   let body = "";
//   request.on("data", (chunk) => {
//     body += chunk.toString();
//   });
//   request.on("end", () => {
//     const { id, name, completed } = JSON.parse(body);
//     if (id === undefined || name === undefined || completed === undefined) {
//       res.writeHead(400, { "Content-Type": "text/plain" });
//       res.end("Bad requestuest");
//     } else {
//       let task = taskList.find((item) => item.id === id || item.name === name);
//       if (task) {
//         res.writeHead(400, { "Content-Type": "text/plain" });
//         res.end("Bad requestuest , item is exited");
//       } else {
//         taskList.push(JSON.parse(body));

//         fs.writeFile("./data/data.json", JSON.stringify(taskList), (err) => {
//           if (err) throw err;
//         });
//         res.writeHead(201, { "Content-Type": "text/plain" });
//         res.end("Created");
//       }
//     }
//   });
// };

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

        fs.writeFile("./data/data.json", JSON.stringify(taskList), (err) => {
          if (err) throw err;
        });
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
