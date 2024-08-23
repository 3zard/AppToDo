var routerMethods = {
  get: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; // because the url is /collection/read
    if (path === pathUrl && request.method === "GET") {
      callback(request, response);
    }
  },
  post: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; // because the url is /collection/create
    if (path === pathUrl && request.method === "POST") {
      callback(request, response);
    }
  },
  delete: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; // because the url is /collection/delete
    if (path === pathUrl && request.method === "DELETE") {
      callback(request, response);
    }
  },
  patch: function (request, response, path, callback) {
    const pathUrl = request.url.split("/")[2]; // because the url is /collection/update
    if (path === pathUrl && request.method === "PATCH") {
      callback(request, response);
    }
  },
};

module.exports = routerMethods;
