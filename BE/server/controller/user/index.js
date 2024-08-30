const { getBody, encodeBase64 } = require("../../utils/helper.js");
const { StatusCode } = require("../../constant/status.js");
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://phong:tp0yu8xGw7EVbRHq@mongo.pvtl6.mongodb.net/";
const client = new MongoClient(uri);

async function login(request, response) {
  try {
    const body = JSON.parse(await getBody(request));
    const { username, password } = body;

    if (!username || !password) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Missing username or password" }));
      return;
    }

    const database = client.db("todoapp");
    const users = database.collection("users");
    const query = { username: username, password: password };
    const user = await users.findOne(query);

    if (!user) {
      response.writeHead(StatusCode.NOT_FOUND, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ message: "User not found" }));
      return;
    }
    const userID = user._id.toString();
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ token: encodeBase64(userID) }));
  } catch (error) {
    console.error("Error during login:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

async function register(request, response) {
  const body = JSON.parse(await getBody(request));
  const { username, password } = body;
  if (!username || !password) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Missing username or password" }));
    return;
  }
  try {
    const isUserNameExited = await fetch("http://localhost:3001/user/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: { username } }),
    });
    if (!isUserNameExited.ok) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Username already exists" }));
      return;
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }

  const user = await fetch("http://localhost:3001/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ record: { ...body } }),
  });
  if (!user.ok) {
    response.writeHead(StatusCode.UNAUTHORIZED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid username or password" }));
    return;
  }
  const data = await user.json();
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

module.exports = {
  login,
  register,
};
