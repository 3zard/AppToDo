const { getBody, encodeBase64 } = require("../../utils/helper.js");
const { StatusCode } = require("../../constant/status.js");
const { MongoClient } = require("mongodb");
const { url } = require("../../constant/status.js");
const client = new MongoClient(url.connectMongodb);

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
    response.end(JSON.stringify({ token: encodeBase64(userID), ...user }));
  } catch (error) {
    console.error("Error during login:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

async function register(request, response) {
  try {
    const body = JSON.parse(await getBody(request));
    const {username, password} = body;

    if (!username || !password)  {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Missing username or password" }));
      return;
    }

    const database = client.db("todoapp");
    const users = database.collection("users");
    const existingUser = await users.findOne({ username: username });
    if (existingUser) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Username already exists" }));
      return;
    }
    await users.insertOne({ username, password });
    response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "User registered successfully" }));
  } catch (error) {
    console.error("Error registering user:", error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Cannot register" }));
  }
}

module.exports = {
  login,
  register,
};
