const logInDetail = require("../../model/Master/login.model");

exports.findUsers = async () => {
  const getUser = await logInDetail.find();
  return getUser;
};

exports.createUser = async (detail) => {
  const createLogin = await new logInDetail(detail);
  return createLogin;
};

exports.findUserByEmail = async (email) => {
  const findUser = await logInDetail.findOne({
    ...email,
  });
  return findUser;
};

exports.findUserWithoutPassword = async (email) => {
  const findUser = await logInDetail.find({}, { password: 0 });
  return findUser;
};

exports.findUserById = async (token) => {
  const findUsersById = await logInDetail.findOne({
    tokenId: token,
  });
  return findUsersById;
};

exports.deleteUserInfo = async (token) => {
  const deleteUser = await logInDetail.deleteOne({
    tokenId: token,
  });
  return deleteUser;
};
