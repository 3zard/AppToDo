const {  getBody, encodeBase64 } = require("../../utils/helper.js");
const { StatusCode } = require("../../constant/status.js");

async function login(request, response) {
  const body = JSON.parse(await getBody(request));
  const { username, password } = body;
  if (!username || !password) {
    response.writeHead(StatusCode.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Missing username or password" }));
    return;
  }
  const user = await fetch("http://localhost:3001/user/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter: {...body} }),
  });
  if (!user.ok) {
    response.writeHead(StatusCode.UNAUTHORIZED, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Invalid username or password" }));
    return;
  }
  const data = await user.json();
  const userID = data[0].id;
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ username: data[0].username,token: encodeBase64(userID) }));
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
      if (isUserNameExited.ok) {
        response.writeHead(StatusCode.BAD_REQUEST, {
          "Content-Type": "text/plain",
        });
        response.end("Username already exists");
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
      body: JSON.stringify({ record: { ...body  } }),
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
  register
};
