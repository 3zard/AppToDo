
var dataRouter = require("../router/databaseRouter.js")

var router = {
  run: function (request, response) {
    dataRouter.run(request, response);
  },
};

module.exports = router;
