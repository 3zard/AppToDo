const { decodeBase64 } = require("../utils/helper");
const { statusCode } = require("../constant/status");
const { MongoClient, ObjectId } = require("mongodb");
const { url } = require("../constant/status.js");
const client = new MongoClient(url.connectMongodb);

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
    response.writeHead(statusCode.UNAUTHORIZED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Token is missing" }));
    return;
  }
  const token = decodeBase64(encodeToken);
  try {
    const database = client.db("todoapp");
    const users = database.collection("users");
    const query = { _id: new ObjectId(token) };
    const user = await users.findOne(query);
    if (!user) {
      response.writeHead(statusCode.UNAUTHORIZED, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid token" }));
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
