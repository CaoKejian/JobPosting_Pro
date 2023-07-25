const requestCount = {};
const lastRequestTime = {};

// 中间件函数，用于限制请求次数
function rateLimit(req, res, next) {
  const ipAddress = req.ip; // 获取请求的 IP 地址

  // 如果该 IP 地址第一次请求，则将请求次数初始化为 1，并记录最近请求时间
  if (!requestCount[ipAddress]) {
    requestCount[ipAddress] = 1;
    lastRequestTime[ipAddress] = Date.now();
  } else {
    // 如果该 IP 地址之前已经请求过，则增加请求次数
    requestCount[ipAddress]++;
  }

  const MAX_REQUESTS_PER_MINUTE = 1; // 一分钟内允许的最大请求数
  const WINDOW_SIZE_IN_MS = 60 * 1000; // 一分钟的时间窗口

  // 如果该 IP 地址的请求次数超过了限制，则返回 429 状态码
  if (requestCount[ipAddress] > MAX_REQUESTS_PER_MINUTE) {
    const timeRemaining = WINDOW_SIZE_IN_MS - (Date.now() - lastRequestTime[ipAddress]);
    res.setHeader('Retry-After', Math.ceil(timeRemaining / 1000)); // 设置 Retry-After 头，表示多久后可以重试
    return res.status(429).send('Too Many Requests');
  }

  // 更新该 IP 地址的最近请求时间
  lastRequestTime[ipAddress] = Date.now();

  // 继续处理后续请求
  next();
}


module.exports = rateLimit;