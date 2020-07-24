const jwt = require('jsonwebtoken');
const {secretKey} = require('../constant/constant');


const createToken = function (tokenObj) {
  return jwt.sign(tokenObj, secretKey, {
    expiresIn: 60 * 60 * 24 // 授权时效24小时
  });
};

module.exports = createToken;
