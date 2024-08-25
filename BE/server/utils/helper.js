const fs = require("fs");
const { StatusCode } = require("../constant/status.js");

function handleNotFound(request, response) {
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

function encodeBase64(input) {
  return Buffer.from(input).toString("base64");
}
function decodeBase64(encoded) {
  return Buffer.from(encoded, "base64").toString("utf-8");
}
module.exports = {
  getBody,
  writeFile,
  handleNotFound,
  encodeBase64,
  decodeBase64,
};

