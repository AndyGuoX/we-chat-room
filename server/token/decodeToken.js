const jwt = require('jsonwebtoken');
const {secretKey} = require('../constant/constant');

const decodeToken = function (req) {
  let token = req.headers.authorization.split(' ')[1];
  return jwt.decode(token, secretKey); // 解码后的token对象
};

module.exports = decodeToken;
