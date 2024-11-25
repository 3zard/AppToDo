const taskRouter = require("./taskRouter");
const userRouter = require("./userRouter");

const router = {
  run: function (request, response) {
    taskRouter.run(request, response);
    userRouter.run(request, response);
  },
};

module.exports = router;
