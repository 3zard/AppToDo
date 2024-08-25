const { decodeBase64 } = require("../utils/helper");
const { StatusCode } = require("../constant/status");

function runMiddleWares(request, response, middlewares) {
  let index = 0;
  function next(userID) {
    if (index < middlewares.length - 1) {
      const middleware = middlewares[index];
      index++;
      middleware(request, response, next);
    } else if (index === middlewares.length - 1) {
      const controller = middlewares[index];
      controller(request, response, userID);
    }
  }
  next();
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
  try {
    const user = await fetch("http://localhost:3001/user/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "filter": { id: token } })
    });
    if (!user.ok) {
      response.writeHead(StatusCode.UNAUTHORIZED, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Token is invalid" }));
      return;
    }
    next(token);
  } catch (error) {
    console.error("Error checking token:", error);
  }
}

module.exports = {
  runMiddleWares,
  checkToken,
};
