const { decodeToken } = require('./jwtHandler');
const users = require('../data/user.json');
const { StatusCode } = require('../utils');

function runMiddleWare(request, response, middlewares) {
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

function checkTokenIsValid(request, response, next) {
  const token = request.headers['authorization']?.split(' ')[1];
  if (!token) {
    response.writeHead(StatusCode.UNAUTHORIZED, { 'Content-Type': 'text/plain' });
    return response.end('Token missing');
  }

  const { decodedPayload, secretKey } = decodeToken(token);
  const user = users.find((user) => user.id === decodedPayload.userId);

  if (user && user.id === secretKey) {
    next(user);
  } else {
    response.writeHead(StatusCode.UNAUTHORIZED, { 'Content-Type': 'text/plain' });
    response.end('Invalid token');
  }
}

module.exports = {
  runMiddleWare,
  checkTokenIsValid,
};