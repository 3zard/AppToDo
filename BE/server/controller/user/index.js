const { StatusCode, getBody } = require("../../utils.js");

async function login(request, response) {
  const body = await getBody(request);
  const { username, password } = JSON.parse(body);
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
    body: JSON.stringify({ filter: { username, password } }),
  });
}

module.exports = {
  login,
};
