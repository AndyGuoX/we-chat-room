const expressJwt = require('express-jwt');
const {secretKey} = require('../constant/constant');

const jwtAuth = expressJwt({
  secret: secretKey,
  credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问
}).unless({ // 不进行验证的接口
  path: ['/api/login', '/api/register', '/api/getAvatar', '/login', '/register', '/']
});

module.exports = jwtAuth;
