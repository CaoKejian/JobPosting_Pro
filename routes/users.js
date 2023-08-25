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
  check('name').notEmpty().withMessage('姓名不能为空'),
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

/** 
  * @param {stuId, email, name }
  * @method 创建用户
  */

router.post('/', createUserValidationRules, verifyJWTAndRenew, validate, async (req, res) => {
  const { stuId, email, name } = req.body
  const x = await UserModel.find({
    stuId: stuId
  })
  const info = {
    stuId: stuId,
    email: email,
    name: name
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

/** 
  * @param {stuId, classId}
  * @method 添加
  */

router.get('/addclassId', async function (req, res) {
  try {
    const { stuId, classId } = req.query
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
    res.status(500).json({ message: '服务器出错！' })
  }
})

/** 
  * @param {stuId, email}
  * @method 发送验证码
  */

let randomCode = 0; // 保存验证码
let stuid // 学号
let codeTimestamp; // 时间戳
router.post('/email', rateLimit, async (req, res, next) => {
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

/** 
  * @param {code}
  * @method 校验验证码|下发jwt
  * @return {Authorization}
  */

router.post('/veifycode', async (req, res, next) => {
  const { code } = req.body
  if (!code) {
    return res.status(400).send({ code: 400, message: '请输入验证码！' });
  }
  // 比较用户输入的验证码与之前保存的随机验证码
  if (code === randomCode) {
    const nowTimestamp = Date.now();
    const timeDifference = nowTimestamp - codeTimestamp;
    const validDuration = 300000;
    if (timeDifference <= validDuration) {
      const secretKey = uuid;
      const payload = { stuId: stuid };
      const options = { expiresIn: '2h' };
      jwt.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          console.error('生成 JWT 出错：', err);
          return res.status(500).json({ code: 500, message: '生成 JWT 出错' });
        }
        // 成功生成 JWT，将 JWT 返回给客户端
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
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

/** 
  * @param {headers.authorization}
  * @method 校验jwt|续期
  */

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

/** 
  * @param {classId, stuIds}
  * @method 查询未交的名单
  * @return {data:[{stuId,classId}]}
  */

router.get('/total', async function (req, res) {
  try {
    const { classId, stuIds } = req.query
    const peopleData = await UserModel.find({ classId }).select('stuId classId');
    const filteredPeopleData = peopleData.filter(item => !stuIds.includes(item.stuId.toString()));
    if (filteredPeopleData) {
      res.json(filteredPeopleData)
    } else {
      res.status(402).json({ message: '未找到班级信息' })
    }
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }
})

/** 
  * @type {Array}
  * @param {stuids}
  * @method 发送邮件给未交同学
  */

router.post('/email/unsubmit', async function (req, res) {
  try {
    const { stuIds } = req.body
    stuIds.map(async item => {
      const data = await UserModel.findOne({stuId: item}).select('email')
      if(!data){
        return
      }
      Email.noticeMail(data.email, '该交作业啦', (state) => {
        if (state) {
          return res.status(200).json(data(200, {}))
        } else {
          return res.status(400).json(data(400, {}, '发送失败'))
        }
      })
    })
    res.send({message: 'ok'})
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }
})


module.exports = router;
