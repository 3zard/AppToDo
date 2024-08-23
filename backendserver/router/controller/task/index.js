const fetch = require('node-fetch');
const { StatusCode } = require('../../utils');
const { createToken } = require('../../middleware/jwtHandler');
const { checkTokenIsValid } = require('../../middleware/checkToken');

async function handleLogin(request, response) {
  try {
    const body = await getBody(request);
    const { username, password } = JSON.parse(body);

    const databaseResponse = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!databaseResponse.StatusCode.Ok) {
      return handleNotFound(request, response);
    }

    const data = await databaseResponse.json();
    const { id } = data;

    const payload = { userId: id, username: username };
    const token = createToken(payload, id);

    response.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ token }));
  } catch (error) {
    console.error('Error during login process:', error);
    response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, { 'Content-Type': 'text/plain' });
    response.end('Internal Server Error');
  }
}

async function getTaskList(request, response) {
  try {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return handleNotFound(request, response);
    }

    checkTokenIsValid(request, response, async (user) => {
      const databaseResponse = await fetch(`http://localhost:3001/tasks/user/${user.id}`);
      if (!databaseResponse.ok) {
        return handleNotFound(request, response);
      }

      const data = await databaseResponse.json();
      response.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(data));
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    handleNotFound(request, response);
  }
}

async function createTask(request, response) {
  try {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return handleNotFound(request, response);
    }

    checkTokenIsValid(request, response, async (user) => {
      const databaseResponse = await fetch(`http://localhost:3001/tasks/user/${user.id}`);
      if (!databaseResponse.ok) {
        return handleNotFound(request, response);
      }

      const data = await databaseResponse.json();
      response.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(data));
    });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    handleNotFound(request, response);
  }
}
module.exports = {
  handleLogin,
  getTaskList,
};