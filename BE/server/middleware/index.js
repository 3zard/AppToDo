const { StatusCode } = require("../utils");

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
function encodeBase64(input) {
  // Chuyển đổi chuỗi sang định dạng Base64
  return Buffer.from(input).toString('base64');
}
function decodeBase64(encoded) {
  // Chuyển đổi chuỗi Base64 sang định dạng chuỗi ban đầu
  return Buffer.from(encoded, 'base64').toString('utf-8');
}
async function checkToken(request, response, next) {
  const encodeToken = request.headers.authorization.replace("Bearer ", "");
  if (!encodeToken) {
    response.writeHead(StatusCode.UNAUTHORIZED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Token is missing" }));
    return;
  }
  const token = decodeBase64(encodeToken);
  const user = await fetch("http://localhost:3001/user/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      body: JSON.stringify({ "filter": { "id": token } }),
    },
  });
  if (!user.ok) {
    response.writeHead(StatusCode.UNAUTHORIZED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Token is invalid" }));
    return;
  }
  next(user);
}

module.exports = {
  runMiddleWares,
  checkToken,
};
