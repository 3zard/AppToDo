const fs = require("fs");

function writeFile(filename, content) {
  fs.writeFile(filename, content, (error) => {
    if (error) {
      throw error;
    }
  });
}

function getBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      resolve(body);
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}
const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

const getStatusCondition = Object.freeze({
  Done: "done",
  Undone: "undone",
  All: "all",
});

module.exports = {
  getBody,
  writeFile,
  StatusCode,
  getStatusCondition
};

