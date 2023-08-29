const jwt = require('jsonwebtoken');
const uuid = require('../secret.key');

// 中间件，用于验证 JWT 是否在有效期内并进行续期
const verifyJWTAndRenew = (req, res, next) => {
  const secretKey = uuid; // 请替换为您的实际密钥

  // 从请求头获取 JWT
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        // 验证失败，说明 JWT 已过期或不合法，直接调用 next() 继续后续处理
        next();
      } else {
        // JWT 验证通过，判断是否在有效期内
        const nowTimestamp = Date.now();
        const expirationTimestamp = decoded.exp * 1000;

        // 设置续期的阈值，这里设置为在过期前 5 分钟内都进行续期
        const renewalThreshold = 5 * 60 * 1000;

        if (expirationTimestamp - nowTimestamp <= renewalThreshold) {
          // 在续期阈值内，进行续期操作
          const newExpirationTimestamp = nowTimestamp + 2 * 60 * 60 * 1000; // 设置新的过期时间为当前时间加上 2 小时
          const newToken = jwt.sign({ ...decoded, exp: newExpirationTimestamp / 1000 }, secretKey);
          
          // 将新的 JWT 设置在响应头的 Authorization 中，供前端使用
          res.setHeader('Authorization', `Bearer ${newToken}`);
        }

        // JWT 验证通过，将解析的 payload 存储在 req.user 中，供后续路由使用
        req.user = decoded;
        next();
      }
    });
  } else {
    // 没有 JWT，直接调用 next() 继续后续处理
    next();
  }
};

module.exports = verifyJWTAndRenew;
