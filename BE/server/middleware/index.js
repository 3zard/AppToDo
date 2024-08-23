const { StatusCode } = require("../utils");
const users = require("../data/user.json");

function runMiddleWares(request, response, middlewares) {
  let index = 0;
  function next(user) {
    if (index < middlewares.length - 1) {
      const middleware = middlewares[index];
      index++;
      middleware(request, response, next);
    } else if (index === middlewares.length - 1) {
      const controller = middlewares[index];
      controller(request, response, user);
    }
  }
  next();
}

function checkToken(request, response, next) {
  const token = request.headers["authorization"] ? request.headers["authorization"].split(" ")[1] : null;
  const user = users.find((user) => user.username === token);
  if (user) {
    next(token);
  } else {
    response.writeHead(StatusCode.UNAUTHORIZED, { "Content-Type": "text/plain" });
    response.end("User undefined");
  }
}

module.exports = {
  runMiddleWares,
  checkToken,
};
