var express = require('express');
const email = require('../mailer/index');
const rateLimit = require('../mailer/utils');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const data = {
    code: 200,
    message: '你好，express'
  }
  res.status(200).send(data)
});

router.get('/email',rateLimit, function(req, res, next) {
	const mail = req.query.id
  console.log(mail);
	const data = (code,data={},msg='发送成功') => ({
		code,data,msg
	})
	if (!mail) {
		return res.status(402).send(data(402,{},"邮件格式错误"))
	} 
	const code = parseInt(Math.random() * 1000000) //生成随机验证码
	email.sendMail(mail, code, (state) => {
		if (state) {
			return res.status(200).send(data(200,{}))
		} else {
			return res.status(400).send(data(400,{},'发送失败'))
		}
	})
});

module.exports = router;
