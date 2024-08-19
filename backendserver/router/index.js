var taskRouter = require("./taskRouter");
var userRouter = require("./userRouter");

var router = {
  run: function (request, response) {
    taskRouter.run(request, response);
    userRouter.run(request, response);
  },
};

module.exports = router;
