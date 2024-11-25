const url = require("url");
const { runMiddleWares } = require("../middleware");

const routerMethods = {
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
  delete: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "DELETE") {
      runMiddleWares(request, response, middlewares);
    }
  },
  patch: function (request, response, path, middlewares) {
    if (path === url.parse(request.url, true).pathname && request.method === "PATCH") {
      runMiddleWares(request, response, middlewares);
    }
  },
};

module.exports = routerMethods;
