var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const uuid = require('./secret.key');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeWorksRouter = require('./routes/homeWork');
var uploadRouter = require('./routes/upload');
var classRouter = require('./routes/class')
var publishRouter = require('./routes/publishWork')
var subjectRouter = require('./routes/subject')

var app = express();
app.use(cors());
app.use(express.static('uploads')); //静态资源

// 禁用默认的中间件日志
app.disable('x-powered-by'); // 可选，禁用 x-powered-by 标识
app.disable('etag'); // 可选，禁用 etag 标识

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 白名单
const excludesPath = ['/api/work/mywork', '/api/user/addclassId', '/api/work']
app.use((req, res, next) => {
  if (req.url.includes('/api/user') || req.originalUrl === '/api/user/veifycode' || excludesPath.some(path => path === req._parsedOriginalUrl.pathname)) {
    next()
    return
  }
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const secretKey = uuid;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: '你没有权限！' })
    } else {
      const nowTimestamp = Date.now();
      const expirationTimestamp = decoded.exp * 1000;
      const renewalThreshold = 5 * 60 * 1000;
      if (expirationTimestamp - nowTimestamp <= renewalThreshold) {
        const newExpirationTimestamp = nowTimestamp + 2 * 60 * 60 * 1000; // 设置新的过期时间为当前时间加上 2 小时
        const newToken = jwt.sign({ ...decoded, exp: newExpirationTimestamp / 1000 }, secretKey);
        res.setHeader('Authorization', `Bearer ${newToken}`);
      }
      req.user = decoded;
      next();
    }
  });
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/work', homeWorksRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/class', classRouter);
app.use('/api/pub', publishRouter);
app.use('/api/subject', subjectRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
