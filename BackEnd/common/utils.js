const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const createOneTimeToken = async (user, secretKey) => {
  try {
    return jwt.sign(
      {
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        role: user?.role,
      },
      secretKey
    );
  } catch (err) {
    return null;
  }
};

const decodeToken = async (token) => {
  try {
    const decode = jwt.verify(token, process.env.SECRET);
    return decode;
  } catch (err) {
    return null;
  }
};

const response = async (
  responseCode,
  responseMessage,
  responseData,
  responseStatus
) => {
  return {
    responseCode,
    responseMessage,
    responseData,
    responseStatus,
  };
};

const uniqueId = async () => {
  return uuidv4();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log("==Date.now() + path.extname(file.originalname)==",Date.now() + path.extname(file.originalname));
    console.log("===file===",file);
    cb(null, Date.now() + path.extname(file.originalname));

  },
});

const upload = multer(
  {
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    console.log("==file===",file);
    const fileTypes = /jpeg|jpg|png|gif|JPG/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("This file formate is not allow to do upload");
  },
}).single("image");

const responseWithJsonBody = (res, statusCode, body, reqHeaders = {}) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  
  const response = {
    headers: reqHeaders,
    body: body
  };

  res.status(statusCode).json(response);
};

module.exports = {
  createOneTimeToken,
  decodeToken,
  response,
  uniqueId,
  upload,
  responseWithJsonBody,
};
