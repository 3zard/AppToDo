const {
  StatusCode,
  writeFile,
  getBody,
  getStatusCondition,
  handleNotFound,
  generateId,
} = require("../utils.js");
const fs = require("fs");

async function readDataBase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/read
  const body = await getBody(request);
  const { filter } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      handleNotFound(request, response);
      return;
    }
    const records = JSON.parse(data);
    const filteredRecords = records.filter((record) => {
      let match = true;
      for (const key in filter) {
        if (record[key] !== filter[key]) {
          match = false;
          break;
        }
      }
      return match;
    });
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.write(JSON.stringify(filteredRecords));
    response.end();
  });
}

async function createDatabase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/create
  const body = await getBody(request);
  const { record } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      handleNotFound(request, response);
      return;
    }
    const records = JSON.parse(data);
    const newRecord = {
      id: generateId(),
      ...record,
    };
    records.push(newRecord);
    writeFile(path, JSON.stringify(records));
    response.writeHead(StatusCode.CREATED, {
      "Content-Type": "application/json",
    });
    response.write(JSON.stringify(newRecord));
    response.end();
  });
}

async function updateDatabase(request, response) {
  try {
    const collection = request.url.split("/")[1]; // Assumes URL format is /collection/update
    const body = await getBody(request);
    if (!body) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid filter or update data" }));
      return;
    }
    const { filter, update } = JSON.parse(body);

    if (
      !filter ||
      !update ||
      Object.keys(filter).length === 0 ||
      Object.keys(update).length === 0
    ) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid filter or update data" }));
      return;
    }

    const path = `./data/${collection}.json`;

    let data;
    try {
      data = await fs.readFile(path, "utf8");
    } catch (error) {
      console.error("Error reading database:", error);
      return;
    }

    const records = JSON.parse(data);
    const updatedRecords = records.map((record) => {
      let match = true;
      for (const key in filter) {
        if (record[key] !== filter[key]) {
          match = false;
          break;
        }
      }
      return match ? { ...record, ...update } : record;
    });

    writeFile(path, JSON.stringify(updatedRecords));

    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
    response.end();
  } catch (error) {
    console.error("Error updating database:", error);
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Failed to update database" }));
  }
}
// async function updateDatabase(request, response) {
//   try {

//   } catch (error) {

//   }
//   const collection = request.url.split("/")[1]; // because the url is /collection/update
//   const body = await getBody(request);
//   const { filter, update } = JSON.parse(body);
//   const path = `./data/${collection}.json`;
//   fs.readFile(path, "utf8", (error, data) => {
//     if (error) {
//       handleNotFound(request, response);
//       return;
//     }
//     const records = JSON.parse(data);
//     const updatedRecords = records.map((record) => {
//       let match = true;
//       for (const key in filter) {
//         if (record[key] !== filter[key]) {
//           match = false;
//           break;
//         }
//       }
//       if (match) {
//         return { ...record, ...update };
//       } else {
//         return record;
//       }
//     });
//     writeFile(path, JSON.stringify(updatedRecords));
//     response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
//     response.write(JSON.stringify(updatedRecords));
//     response.end();
//   });
// }
async function deleteDatabase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/delete
  const body = await getBody(request);
  const { filter } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      handleNotFound(request, response);
      return;
    }
    const records = JSON.parse(data);
    const updatedRecords = records.filter((record) => {
      let match = true;
      for (const key in filter) {
        if (record[key] !== filter[key]) {
          match = false;
          break;
        }
      }
      return !match;
    });

    writeFile(path, JSON.stringify(updatedRecords));
    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
    response.write(JSON.stringify(updatedRecords));
    response.end();
  });
}

module.exports = {
  readDataBase,
  createDatabase,
  updateDatabase,
  deleteDatabase,
};
