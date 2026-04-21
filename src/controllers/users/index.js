const { blockUser } = require("./block-user.controller");
const { unblockUser } = require("./unblock-user.controller");
const { listUsers } = require("./list-user.controller");
const { getUser } = require("./get-user.controller");

const userControllers = {
  blockUser,
  unblockUser,
  listUsers,
  getUser
};

module.exports = {
  ...userControllers,
  userControllers
};
