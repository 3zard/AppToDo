
const userList = require("../../data/user.json");
const { StatusCode, getBody , writeFile } = require("../../utils.js");


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

async function readDb(request, response) {
    const body = await getBody(request);
    const { collection , user: requestUser } = JSON.parse(body)
    if ( collection === "user") {
        const data = userList.filter((user) => user.username === requestUser.username )
        
        response.writeHead(StatusCode.OK, {"Content-Type": "application/json",});
        response.end(JSON.stringify(data));
    } else {
        response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
        response.end("wrong collection");
    }
}
async function createDb(request, response) {
    const body = await getBody(request);
    const { collection , user: requestUser} = JSON.parse(body)
    
    if ( collection === "user") {
        userList.push(requestUser)
        
        writeFile("./data/user.json", JSON.stringify(userList));
        response.writeHead(StatusCode.OK, {"Content-Type": "application/json",});
        response.end(JSON.stringify(requestUser));
    } else {
        response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
        response.end("wrong collection");
    }
}

async function updateDb(request, response) {
    const body = await getBody(request);
    const { collection , user: requestUser } = JSON.parse(body)
    if ( collection === "user") {
        let currentUser = userList.find(user => user.username === requestUser.username)
        if (currentUser) {
            currentUser.password = requestUser.password
        }
        writeFile("./data/user.json", JSON.stringify(userList));
        response.writeHead(StatusCode.OK, {"Content-Type": "application/json",});
        response.end(JSON.stringify(requestUser));
    } else {
        response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
        response.end("wrong collection");
    }
}
async function deleteDb(request, response) {
    const body = await getBody(request);
    const { collection , user: requestUser } = JSON.parse(body)
    if ( collection === "user") {
        let newList = userList.filter(user => user.username !== requestUser.username)
        writeFile("./data/user.json", JSON.stringify(newList));
        response.writeHead(StatusCode.OK, {"Content-Type": "application/json",});
        response.end(JSON.stringify(requestUser));
    } else {
        response.writeHead(StatusCode.BAD_REQUEST, { "Content-Type": "text/plain" });
        response.end("wrong collection");
    }
}

module.exports = {
    login,
    updateDb,
    createDb,
    readDb,
    deleteDb
}


