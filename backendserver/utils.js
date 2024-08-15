const fs = require("fs");

const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHODS_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

function handleNotFound(response) {
  response.writeHead(StatusCode.NOT_FOUND, { "Content-Type": "text/plain" });
  response.end("Not Found");
}

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

function handleMethodsNotAllow(response) {
  response.writeHead(StatusCode.METHODS_NOT_ALLOWED, { "Content-Type": "text/plain" });
  response.end("Method Not Allowed");
}

module.exports = {
  getBody,
  writeFile,
  StatusCode,
  handleNotFound,
  handleMethodsNotAllow,
};
