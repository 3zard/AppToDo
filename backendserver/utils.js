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

module.exports = {
  getBody,
  writeFile,
};
