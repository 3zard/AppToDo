const url = require("url");


var routerMethods = {
  get: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "GET") {
      middlewares(request, response);
    }
  },
  post: function (request, response, path, middlewares) {
    if (path === request.url && request.method === "POST") {
      middlewares(request, response);

    }
  },
  delete: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "DELETE") {
      middlewares(request, response);


    }
  },
  patch: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "PATCH") {
      middlewares(request, response);


    }
  },
};

module.exports = routerMethods;
