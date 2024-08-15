const { createServer } = require("node:http");
const routes = require("./router");
const { handleNotFound, handleMethodsNotAllow } = require("./utils.js");
const url = require("url")
const hostname = "localhost";
const port = 3000;

const server = createServer((request, response) => {
  const parsedUrl = url.parse(request.url);
  const routeHandler = routes[parsedUrl.pathname];
  if (routeHandler) {
    if (routeHandler[request.method]) {
      routeHandler[request.method](request, response);
    } 
    else {
      handleMethodsNotAllow(response);
    }
  } 
  else {
      handleNotFound(response);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
