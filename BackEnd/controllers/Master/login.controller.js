const httpStatus = require("http-status");
const message = require("../../common/error.message");
const { decodeToken } = require("../../common/utils");
const loginData = require("../../service/Master/login.service");
const commonService = require("../../common/utils");

exports.signUp = async (req, res) => {
  try {
    const headers = req.headers["access_token"];
    const tokenData = await decodeToken(headers);
    if (!tokenData) {
      const response = await commonService.response(
        0,
        message.INVALID_TOKEN,
        null,
        message.ERROR
      );
      return res.status(httpStatus.NOT_FOUND).json(response);
    }

    const token = await commonService.createOneTimeToken(
      req.body,
      process.env.SECRET
    );

    async function createData(role, email) {
      if (role === "Admin" && email === "Sanjay08_nr@yahoo.com") {
        const createUser = await loginData.loginService(req.body, token);
        return createUser;
      }
    }
    const user = await createData(tokenData.role, tokenData.email);
    res.status(user.status).send(user);
  } catch (error) {
    console.log("==error==", error);
    if (error.name === "ValidationError") {
      for (const err of Object.values(error.errors)) {
        const errorMessages = err.message
        res.status(400).send({
          status: 400,
          message: errorMessages
        });
      }
    } else {
      res.status(500).json({ error: message.UNIQUE_USER });
    }
  }
};

exports.getUsers = async (req, res) => {
  try {
    let userDetails = await loginData.findUserRoles();

    if (!Array.isArray(userDetails)) {
      return res.status(userDetails.status).send(userDetails);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = userDetails;
    // .slice(startIndex, endIndex);

    const totalItems = userDetails.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "user" : "users";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} available`,
    };
    res.status(200).send(response);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await loginData.findUser({ email });

    if (!user) {
      const response = await commonService.response(
        0,
        message.USER_NOT_FOUND,
        null,
        message.ERROR
      );
      return res.status(httpStatus.NOT_FOUND).json(response);
    }

    if (password !== user.password) {
      const response = await commonService.response(
        0,
        message.MISMATCH_PASSWORD,
        null,
        message.ERROR
      );
      return res.status(httpStatus.NOT_FOUND).json(response);
    }

    let tokenData = {
      name: user["name"],
      email: user["email"],
      phoneNumber: user["phoneNumber"],
      isAdmin: user["role"] === "Admin" ? true : false,
    };
    const token = await commonService.createOneTimeToken(
      tokenData,
      process.env.SECRET
    );

    const response = {
      message: message.USER_SUCCESS_LOGIN,
      token,
      isAdmin: user.role === "Admin" ? true : false,
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};

exports.editUser = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editUserData = await loginData.editUserDetail(req.body, token);

    res.status(editUserData.status).send(editUserData);
  } catch (error) {
    console.log("==error==", error);
    if (error.name === "ValidationError") {
      for (const err of Object.values(error.errors)) {
        const errorMessages = err.message
        res.status(400).send({
          status: 400,
          message: errorMessages
        });
      }
    } else {
      res.status(500).json({ error: message.UNIQUE_USER });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteUserData = await loginData.deleteUserDetail(token);

    res.status(deleteUserData.status).send(deleteUserData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
