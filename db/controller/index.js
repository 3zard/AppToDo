const { StatusCode, getBody, writeFile } = require("../utils.js");
const fs = require("fs");

async function readDb(request, response) {
  const body = await getBody(request);
  const { collection } = JSON.parse(body);
  console.log(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, (err, data) => {
    if (err) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "text/plain",
      });
      response.end("File not found");
      return;
    }
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(data);
  });
}
async function createDb(request, response) {
  const body = await getBody(request);

  const collection = request.url.split("/")[2];
  const { record } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, (err, data) => {
    if (err) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "text/plain",
      });
      response.end("File not found");
    } else {
      data.push({ id: data.length + 1, ...record });
      writeFile(path, JSON.stringify(data));
    }
  });
}

async function updateDb(request, response) {
  const body = await getBody(request);
  const { collection, record } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, (err, data) => {
    if (err) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "text/plain",
      });
      response.end("File not found");
      return;
    }

    let newRecord = data.find((item) => item.id === record.id);
    if (!newRecord) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      response.end("Record not found");
      return;
    }
    newRecord = { ...record };
    writeFile(path, JSON.stringify(data));
  });
}

async function deleteDb(request, response) {
  const body = await getBody(request);
  const { collection, id } = JSON.parse(body);
  const path = `./data/${collection}.json`;
  fs.readFile(path, (err, data) => {
    if (err) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "text/plain",
      });
      response.end("File not found");
    } else {
      data.find((item) => item.id === id);
      data = data.filter((item) => item.id !== id);
      writeFile(path, JSON.stringify(data));
    }
  });
}
module.exports = {
  updateDb,
  createDb,
  readDb,
  deleteDb,
};
