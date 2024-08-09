const { createServer } = require("node:http");
const { router } = require("./router/router.js");
const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((request, response) => {
  router(request, response);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
