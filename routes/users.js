var express = require('express');
var router = express.Router();
const UserModel = require('../model/user');
const Email = require('../mailer/index');
const rateLimit = require('../mailer/utils');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const uuid = require('../secret.key')

// 定义数据验证规则
const createUserValidationRules = [
  check('stuId').notEmpty().withMessage('学号不能为空'),
  check('email').notEmpty().withMessage('邮箱不能为空').isEmail().withMessage('请输入有效的邮箱地址'),
];

// 中间件，用于处理数据验证
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

/* GET users listing. */
router.post('/', createUserValidationRules, validate, async (req, res) => {
  const { stuId, email } = req.body
  const x = await UserModel.find({
    stuId: stuId
  })
  const info = {
    stuId: stuId,
    email: email
  }
  if (x.length !== 0) {
    res.status(202).json({ message: '用户已存在', data: x });
  } else {
    try {
      const data = await UserModel.create(info)
      res.status(201).json({ message: '用户创建成功', data: data });
    } catch (error) {
      res.status(500).json({ message: '创建用户失败', error: error.message });
    }
  }
});

let randomCode; // 保存验证码
let stuid
router.post('/email', async (req, res, next) => {
  const { stuId, email } = req.body
  stuid = stuId
  const data = await UserModel.find({
    stuId
  })
  if (data.length !== 0) {
    if (data[0].email !== email || data[0].stuId !== +stuId) {
      return res.status(421).json({ message: '学号或邮箱不属于本人！' })
    }
  }
  if (data.length !== 0) {
    const data = (code, data = {}, msg = '发送成功') => ({
      code, data, msg
    })
    if (!email) {
      return res.status(402).json(data(402, {}, "邮件格式错误"))
    }
    randomCode = parseInt(Math.random() * 1000000) //生成随机验证码
    Email.sendMail(email, randomCode, (state) => {
      if (state) {
        return res.status(200).json(data(200, {}))
      } else {
        return res.status(400).json(data(400, {}, '发送失败'))
      }
    })
  } else {
    return res.status(420).json({ message: '服务器出错，联系工作人员！' })
  }
});

router.post('/veifycode', async (req, res, next) => {
  const { code } = req.body
  if (!code) {
    return res.status(400).send({code:400, message: '请输入验证码！' });
  }
  // 比较用户输入的验证码与之前保存的随机验证码
  if (parseInt(code) === randomCode) {
     // 验证码输入正确，生成 JWT
     const secretKey = uuid; // 请替换为您的实际密钥
     const payload = { stuId: stuid }; // 可根据需要设置 JWT 的 payload
     const options = { expiresIn: '2h' }; // 设置 JWT 的有效期，这里设置为 1 小时
     jwt.sign(payload, secretKey, options, (err, token) => {
       if (err) {
         console.error('生成 JWT 出错：', err);
         return res.status(500).json({ code: 500, message: '生成 JWT 出错' });
       }
       // 成功生成 JWT，将 JWT 返回给客户端
       res.setHeader('Authorization', `Bearer ${token}`);
       return res.status(200).json({ message: '验证码输入正确！'});
     });
  } else {
    return res.status(401).send({code:401,message:'验证码错误！'});
  }
})
module.exports = router;
