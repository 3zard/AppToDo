const url = require("url");
const { runMiddleWares } = require("../middleware");

var routerMethods = {
  get: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "GET") {
      runMiddleWares(request, response, middlewares);
    }
  },
  post: function (request, response, path, middlewares) {
    if (path === request.url && request.method === "POST") {
      runMiddleWares(request, response, middlewares);
    }
  },
  delete: function (request, response, path, callback) {
    if (path === url.parse(request.url, true).pathname && request.method === "DELETE") {
      callback(request, response);
    }
  },
  patch: function (request, response, path, callback) {
    if (path === url.parse(request.url, true).pathname && request.method === "PATCH") {
      callback(request, response);
    }
  },
};

module.exports = routerMethods;
