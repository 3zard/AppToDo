const router = require("./router/index.js");
const createServer = require("http").createServer;

const server = createServer((request, response) => {
  router.run(request, response);
});

server.listen(3001, "localhost", () => {
  console.log("Listening on localhost:3001");
});
