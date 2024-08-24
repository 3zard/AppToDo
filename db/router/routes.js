const { create } = require("domain");

module.exports = {
  user: {
    login: "/login",
    register: "/register",
  },
  data: {
    read: "/read",
    create: "/create",
    update: "/update",
    delete: "/delete",
  }
};
