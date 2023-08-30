// authMiddleware.js
/**
 * @method 模拟jwt校验防止测试用例失败
 * */
const jwt = require('jsonwebtoken');
const uuid = require('../secret.key')

module.exports = function (req, res, next) {
  const token = jwt.sign({ stuId: 2001063037 }, uuid);
  req.headers.authorization = `Bearer ${token}`;
  next();
};
