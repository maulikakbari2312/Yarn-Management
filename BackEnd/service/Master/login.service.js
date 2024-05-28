const message = require("../../common/error.message");
const {
  findUsers,
  createUser,
  findUserByEmail,
  findUserWithoutPassword,
  findUserById,
  deleteUserInfo,
} = require("../../DBQuery/Master/login");
const logInDetail = require("../../model/Master/login.model");

exports.loginService = async (data, userToken) => {
  try {
    const getUser = await findUsers();

    for (const ele of getUser) {
      if (ele.email.toLocaleLowerCase() === data.email.toLocaleLowerCase()) {
        return {
          status: 400,
          message: "User email cannot be the same!",
        };
      }
    }

    const detail = {
      name: data.name,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
      token: userToken,
    };

    const createSuperAdmin = await createUser(detail);
    const createData = await createSuperAdmin.save();
    return {
      status: 201,
      message: message.USER_CREATED,
      data: createData,
    };
  } catch (error) {
    throw error;
  }
};

exports.findUser = async (userData) => {
  try {
    const user = await findUserByEmail(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.findUserRoles = async () => {
  try {
    const users = await findUserWithoutPassword();
    if (users.length === 0) {
      return {
        status: 400,
        message: message.USER_NOT_FOUND,
      };
    }
    return users;
  } catch (error) {
    throw error;
  }
};

exports.editUserDetail = async (data, token) => {
  try {
    const getUserEmail = await findUserByEmail({ email: data.email });
    if (
      getUserEmail &&
      getUserEmail.tokenId !== token &&
      getUserEmail.email.toLocaleLowerCase() === data.email.toLocaleLowerCase()
    ) {
      return {
        status: 400,
        message: "User email cannot be the same!",
      };
    }

    const userData = {
      name: data.name,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
    };

    const userToUpdate = await findUserById(token);

    if (!userToUpdate) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    userToUpdate.set(userData);

    // When updating records in MongoDB using Mongoose, the validation is not automatically triggered.
    //  However, you can manually trigger validation by calling the validate method on the instance before saving it.
    //  Here's an updated version of your colorCode:

    const validationError = userToUpdate.validateSync();
    if (validationError) {
      const errorMessage =
        validationError.errors[Object.keys(validationError.errors)[0]].message;
      return {
        status: 400,
        message: errorMessage,
      };
    }
    const editUser = await userToUpdate.save();
    return {
      status: 200,
      message: "User data updated successfully",
      data: editUser,
    };
  } catch (error) {
    console.log("==error===", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteUserDetail = async (token) => {
  try {
    const deleteUser = await deleteUserInfo(token);
    if (!deleteUser) {
      return {
        status: 404,
        message: "Unable to delete User",
      };
    }
    return {
      status: 200,
      message: message.USER_DELETE,
      data: deleteUser,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};
