const routerMethods = {
  get: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; 
    if (path === pathUrl && request.method === "GET") {
      callback(request, response);
    }
  },
  post: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; 
    if (path === pathUrl && request.method === "POST") {
      callback(request, response);
    }
  },
  delete: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2];
    if (path === pathUrl && request.method === "DELETE") {
      callback(request, response);
    }
  },
  patch: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; 
    if (path === pathUrl && request.method === "PATCH") {
      callback(request, response);
    }
  },
};

module.exports = routerMethods;
