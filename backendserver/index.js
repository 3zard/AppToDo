const { createServer } = require("node:http");
const { route } = require("./router/router.js");
const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((request, response) => {
  const controller = route(request);
  controller(request, response);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
