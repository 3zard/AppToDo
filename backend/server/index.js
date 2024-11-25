const router = require("./router/index.js");
const createServer = require("http").createServer;


const server = createServer((request, response) => {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, or specify a particular origin
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
      response.writeHead(204); // No content
      response.end();
      return;
  }
  router.run(request, response);
});

server.listen(3000, "localhost", () => {
  console.log("Listening on localhost:3000");
});




