var express = require('express');
var router = express.Router();
const UserModel = require('../model/user');
const Email = require('../mailer/index');
const rateLimit = require('../mailer/utils');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const uuid = require('../secret.key');
const verifyJWTAndRenew = require('../middleware/verifyJWT');
const ClassInfoModel = require('../model/classInfo');

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
    name: name,
    isAuth: false,
    isRoot: false
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
  * @param {page}
  * @method 查询所有已登录的同学和老师
  */

router.get('/all', async function (req, res) {
  try {
    const { page } = req.query
    const limitNumber = 10
    const skip = (page - 1) * limitNumber;
    const totalDocuments = await UserModel.countDocuments({});
    const data = await UserModel.find({}).skip(skip).limit(limitNumber)
    // 计算总页数
    const totalPages = Math.ceil(totalDocuments / limitNumber);
    res.json({
      code: 200,
      message: '查询成功',
      data,
      pagination: {
        total: totalDocuments,
        currentPage: page,
        totalPages,
        perPage: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

/** 
  * @param {classId}
  * @method 查询本班所有同学
  */

router.get('/demand', async function (req, res) {
  try {
    const { classId } = req.query
    const data = await UserModel.find({ classId }).select('stuId name classId');
    if (data.length !== 0) {
      res.json(data);
    } else {
      res.json({ message: '班级下还没有同学注册！' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

/** 
  * @type {type:name|stuId|clssId|Auth|Root,value}
  * @param {type,value}
  * @method 根据type来查询
  */

router.get('/type/search', async function (req, res) {
  try {
    const { type, value, page } = req.query
    const limitNumber = 10
    const skip = (page - 1) * limitNumber;
    const totalDocuments = type==='classId' ? await UserModel.countDocuments({ classId: +value }) : 0;
    let result;
    switch (type) {
      case 'name':
        result = await UserModel.find({ name: value });
        break;
      case 'stuId':
        result = await UserModel.find({ stuId: +value });
        break;
      case 'classId':
        result = await UserModel.find({ classId: +value }).skip(skip).limit(limitNumber)
        break;
      case 'Auth':
        result = await UserModel.find({ isAuth: true });
        break;
      case 'Root':
        result = await UserModel.find({ isRoot: true });
        break;
      default:
        return res.status(400).json({ message: '无效的查询类型' });
    }
    const totalPages = Math.ceil(totalDocuments / limitNumber);
    if (result.length > 0) {
      res.status(200).json({
        code: 200,
        message: '查询成功',
        data: result,
        pagination: type !== 'classId' ? {} : {
          total: totalDocuments,
          currentPage: page,
          totalPages,
          perPage: limitNumber,
        },
      });
    } else {
      res.status(400).json({ message: '未找到匹配的记录' });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

/** 
  * @param {stuId, classId}
  * @method 添加至所选班级
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
  * @type {number, []:已经提交过的学号}
  * @param {classId, stuIds}
  * @method 查询未交的名单
  * @return {data:[{stuId,classId}]}
  */

router.get('/total', async function (req, res) {
  try {
    const { classId, stuIds } = req.query
    const peopleData = await UserModel.find({ classId }).select('stuId classId name');
    const filteredPeopleData = peopleData.filter(item => !stuIds.includes(item.stuId.toString()));
    if (peopleData.length === 0) {
      return res.status(402).json({ message: '未找到任何信息' })
    }
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
  * @type {stuIds:Array}
  * @param {stuIds,url,user,branch,content,cutTime }
  * @method 发送邮件给未交同学
  */

router.post('/email/unsubmit', async function (req, res) {
  try {
    const { stuIds, url, user, branch, content, cutTime, unSubmit } = req.body
    stuIds.map(async item => {
      const data = await UserModel.findOne({ stuId: item }).select('email name')
      if (!data) {
        return
      }
      const obj = { stuIds, url, user, branch, content, cutTime, unSubmit, name: data.name }
      Email.noticeMail(data.email, obj, (state) => {
        if (state) {
          return res.status(200).json(data(200, {}))
        } else {
          return res.status(400).json(data(400, {}, '发送失败'))
        }
      })
    })
    res.send({ message: 'ok' })
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }
})

/** 
  * @param {stuId, email, name}
  * @method 判断信息是否被篡改|权限信息是否正确
  */

router.post('/isself/auth', async function (req, res) {
  try {
    const { stuId, email, name } = req.body
    // 白名单 > 总裁权限
    const whiteArr = [2001]
    if (whiteArr.includes(stuId)) {
      return res.send({ message: 'ok' })
    }
    const data = await UserModel.findOne({ stuId, email, name })
    if (data) {
      res.send({ message: 'ok' })
    } else {
      res.status(401).json({ message: '个人信息有误，请重新登录！' })
    }
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }
})

/** 
  * @type {info:{}}
  * @param {info}
  * @method 查询总裁权限
  * @return {true|false}
  */

router.get('/president/auth', async function (req, res) {
  const { stuId } = req.query
  try {
    const data = await UserModel.find({ stuId })
    if (data.length === 0) {
      return res.status(200).json({ data: [] })
    }
    if (data[0].isAuth) {
      return res.status(200).json({ data: true });
    }
    res.status(200).json({ data: false })
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
})

/** 
  * @type {info:{}}
  * @param {info}
  * @method 查询管理员权限
  * @return {true|false}
  */

router.get('/root/auth', async function (req, res) {
  const { stuId } = req.query
  try {
    const data = await UserModel.find({ stuId })
    if (data.length === 0) {
      return res.status(200).json({ data: [] })
    }
    if (data[0].isRoot) {
      return res.status(200).json({ data: true });
    }
    res.status(200).json({ data: false })
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
})

/** 
  * @param {stuId:number, isRoot:Boolean}
  * @param {stuId, isRoot}
  * @method 设置总裁权限|默认设置总裁权限，如果传入isRoot=true，设置管理员权限
  */

router.post('/president/set', async function (req, res) {
  const { stuId, isRoot = false } = req.body
  try {
    const data = await UserModel.findOne({ stuId })
    if (data) {
      await UserModel.updateOne({ stuId: data.stuId }, { $set: { isAuth: true, isRoot: isRoot } })
      await ClassInfoModel.updateOne({ stuId: data.stuId }, { $set: { isAuth: true, isRoot: isRoot } })
      res.status(200).json({ data: true })
    } else {
      res.status(400).json({ message: '没有该同学信息！' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
})

/** 
  * @param {stuId:number}
  * @param {stuId}
  * @method 删除所有权限
  */

router.post('/president/delete', async function (req, res) {
  const { stuId } = req.body
  try {
    const data = await UserModel.findOne({ stuId })
    if (data) {
      await UserModel.updateOne({ stuId: data.stuId }, { $set: { isAuth: false, isRoot: false } })
      await ClassInfoModel.updateOne({ stuId: data.stuId }, { $set: { isAuth: false, isRoot: false } })
      res.status(200).json({ data: true })
    } else {
      res.status(400).json({ message: '没有该同学信息！' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
})

router.get('/insert/test', async function (req, res) {
  try {
    const testData = [
      { stuId: 2001063037, email: "caokejian@foxmail.com", name: "曹珂俭", classId: 123123, isAuth: true, isRoot: true },
      { stuId: 2001062028, email: "2594838054@qq.com", name: "黄梦瑶", classId: 123123, isAuth: false, isRoot: false },
      { stuId: 2001062067, email: "3192410351@qq.com", name: "王硕", classId: 123123, isAuth: false, isRoot: false },
      { stuId: 2001062036, email: "515694789@qq.com", name: "蔡奇奇", classId: 123123, isAuth: false, isRoot: false },
      { stuId: 2001040023, email: "2256876027@qq.com", name: "李梓良", classId: 123123, isAuth: false, isRoot: false },
      { stuId: 2001062011, email: "971602307@qq.com", name: "聂宇博", classId: 123123, isAuth: false, isRoot: false },
      { stuId: 2001063036, email: "770527697@qq.com", name: "张博涵", classId: 123123, isAuth: false, isRoot: false },
    ]
    const data = await UserModel.insertMany(testData)
    if (data) {
      res.send(data)
    }
  } catch (error) {
    res.status(500).json({ message: "服务器出错！" })
  }
})
module.exports = router;
