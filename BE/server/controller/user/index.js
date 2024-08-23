const userList = require("../../data/user.json");
const { StatusCode, getBody } = require("../../utils.js");


async function login(request, response) {
    const body = await getBody(request);
    const { username , password } = JSON.parse(body);
    let user = userList.find((item) => item.username === username && item.password === password)
    
    if(user) {
        let token = user.username
        response.writeHead(StatusCode.OK, {"Content-Type": "application/json",});
        response.end(JSON.stringify(token));
    } else {
        response.writeHead(StatusCode.UNAUTHORIZED, { "Content-Type": "text/plain" });
        response.end("User undefined");
    }
    
}

module.exports = {
    login
}


