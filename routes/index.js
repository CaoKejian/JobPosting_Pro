var express = require('express');
const isMock = require('../middleware/isMock');

var router = express.Router();

/* GET home page. */
router.get('/', isMock, async function (req, res, next) {
  const data = {
    type: 'success',
    dsc: '您已进入Mock环境，此数据非有效数据！',
    data: []
  }
  res.status(200).send(data)
});

/* Mock classInfos  */
router.get('/classInfo', isMock, async function (req, res, next) {
  const data = {
    code: 200,
    message: '你好，express'
  }
  res.status(200).send(data)
});

module.exports = router;
