var express = require('express');
var router = express.Router();
const UserModel = require('../model/user');
const Email = require('../mailer/index');
const rateLimit = require('../mailer/utils');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const uuid = require('../secret.key');
const verifyJWTAndRenew = require('../middleware/verifyJWT');

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
router.post('/', createUserValidationRules, verifyJWTAndRenew, validate, async (req, res) => {
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
router.get('/addclassId', async function (req, res) {
  try {
    const { stuId,classId } = req.query
    const updatedData = await UserModel.findOneAndUpdate(
      { stuId }, // 匹配的查询条件
      { $set: { classId } }, // 更新的操作，$set 操作符用于设置字段的值
      { new: true } // 选项，返回更新后的文档
    );
    if (updatedData) {
      res.json({ success: true, updatedData });
    } else {
      res.json({ success: false, message: '学号没找到！' });
    }
  } catch (error) {
    res.status(500).json({message:'服务器出错！'})
  }
})

let randomCode = 0; // 保存验证码
let stuid // 学号
let codeTimestamp; // 时间戳
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
    var code_fill_str = ["000000", "00000", "0000", "000", "00", "0", ""];
    var code = '' + parseInt(Math.random() * 1000000);
    randomCode = code_fill_str[code.length] + code;
    // randomCode = Number(code)
    codeTimestamp = Date.now(); // 记录验证码生成的时间戳
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
    return res.status(400).send({ code: 400, message: '请输入验证码！' });
  }
  // 比较用户输入的验证码与之前保存的随机验证码
  if (code === randomCode) {
    const nowTimestamp = Date.now(); // 获取当前时间戳
    const timeDifference = nowTimestamp - codeTimestamp; // 计算当前时间与验证码生成时间的差值
    // 设置验证码有效期为 5 分钟，即 300000 毫秒
    const validDuration = 300000;
    if (timeDifference <= validDuration) {
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
        return res.status(200).json({ message: '验证码输入正确！' });
      });
    } else {
      // 验证码已过期，返回错误信息给前端
      return res.status(401).send({ code: 401, message: '验证码已过期！' });
    }

  } else {
    return res.status(401).send({ code: 401, message: '验证码错误！' });
  }
})

router.get('/verify/jwt', async (req, res, next) => {
  const token = req.headers.authorization; // Get the JWT token from the request headers
  if (!token) {
    return res.status(401).json({ message: 'No JWT token provided.' });
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), uuid);
    const isExpired = Date.now() >= decoded.exp * 1000;
    if (isExpired) {
      return res.status(401).json({ message: 'JWT令牌已过期' });
    }
    const newToken = jwt.sign({ stuId: stuid }, uuid, { expiresIn: '2h' });
    res.setHeader('Authorization', `Bearer ${newToken}`);
    res.status(200).json({ message: 'JWT token is valid.' });
  } catch (err) {
    return res.status(401).json({ message: '无效的JWT令牌' });
  }
});

router.get('/total', async function (req, res) {
  try {
  
    if (data) {
      res.json(data)
    } else {
      res.status(402).json({ message: '未找到班级信息' })
    }
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }

})
// router.get()
module.exports = router;
