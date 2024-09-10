const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { Token } = require("../model");

const authenticateToken = (requset, response, next) => {
  const authHeader = requset.headers["authorization"];
  if (!authHeader) {
    return response
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.JWT_SECRET, (error, user) => {
    if (error) {
      return response
        .status(403)
        .send({ message: "Access denied. Invalid token." });
    }

    requset.user = user;
    next();
  });
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(300, "minutes");
  const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "300m",
  });

  const refreshTokenExpires = moment().add(30, "days");
  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });

  const tokenAlreadyExist = await Token.findOne({
    userId: user._id,
  });

  if (tokenAlreadyExist) {
    tokenAlreadyExist.token = refreshToken;
    tokenAlreadyExist.expiresIn = moment(refreshTokenExpires).toDate();
    await tokenAlreadyExist.save();
  } else {
    const newToken = new Token({
      token: refreshToken,
      userId: user._id,
      expiresIn: moment(refreshTokenExpires).toDate(),
    });
    await newToken.save();
  }

  return {
    access: {
      token: accessToken,
      expires: moment(accessTokenExpires).toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: moment(refreshTokenExpires).toDate(),
    },
  };
};

module.exports = {
  authenticateToken,
  generateAuthTokens,
};
