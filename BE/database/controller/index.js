const {
  StatusCode,
  writeFile,
  getBody,
  handleNotFound,
  generateId,
} = require("../utils.js");
const fs = require("fs").promises;

async function readDataBase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/read
  const body = await getBody(request);
  const { filter } = JSON.parse(body);
  if (!filter || Object.keys(filter).length === 0) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid filter data" }));
    return;
  }
  const path = `./data/${collection}.json`;
  let data;
  try {
    data = await fs.readFile(path, "utf8");
  } catch (error) {
    console.error("Error reading database:", error);
  }
  const records = JSON.parse(data);
  const filteredRecords = records.filter((record) => {
    let match = true;
    for (const key in filter) {
      if (record[key].toString() !== filter[key].toString()) {
        match = false;
        break;
      }
    }
    return match;
  });
  if (filteredRecords.length === 0) {
    handleNotFound(request, response);
    return;
  }
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.write(JSON.stringify(filteredRecords));
  response.end();
}

async function createDatabase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/create
  const body = await getBody(request);
  const { record } = JSON.parse(body);
  if (!record || Object.keys(record).length === 0) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid record data" }));
    return;
  }
  const path = `./data/${collection}.json`;
  let data;
  try {
    data = await fs.readFile(path, "utf8");
  } catch (error) {
    console.error("Error reading database:", error);
    response.writeHead(StatusCode.NOT_FOUND, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Collection not found" }));
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
}

async function updateDatabase(request, response) {
  try {
    const collection = request.url.split("/")[1]; // Assumes URL format is /collection/update
    const body = await getBody(request);
    if (!body) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid request body" }));
      return;
    }
    const { record } = JSON.parse(body);
    if (!record || Object.keys(record).length === 0) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid record data" }));
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
    const updatedRecords = records.map((item) =>
      item.id === record.id.toString() ? record : item
    );
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

async function deleteDatabase(request, response) {
  const collection = request.url.split("/")[1]; // because the url is /collection/delete
  const body = await getBody(request);
  const { record } = JSON.parse(body);
  if (!record || Object.keys(record).length === 0) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid filter data" }));
    return;
  }
  const path = `./data/${collection}.json`;
  let data;
  try {
    data = await fs.readFile(path, "utf8");
  } catch (error) {
    console.error("Error reading database:", error);
    response.writeHead(StatusCode.NOT_FOUND, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Collection not found" }));
  }
  const records = JSON.parse(data);
  const updatedRecords = records.filter(
    (item) => item.id !== record.id.toString()
  );
  writeFile(path, JSON.stringify(updatedRecords));
  response.writeHead(StatusCode.NO_CONTENT, {
    "Content-Type": "application/json",
  });
  response.write(JSON.stringify(updatedRecords));
  response.end();
}

module.exports = {
  readDataBase,
  createDatabase,
  updateDatabase,
  deleteDatabase,
};
