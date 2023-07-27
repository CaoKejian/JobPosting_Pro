var express = require('express');
var router = express.Router();
const UserModel = require('../model/user');
const { check, validationResult } = require('express-validator');

// 定义数据验证规则
const createUserValidationRules = [
  check('name').notEmpty().withMessage('姓名不能为空'),
  check('stuId').notEmpty().withMessage('学号不能为空'),
  check('mail').notEmpty().withMessage('邮箱不能为空').isEmail().withMessage('请输入有效的邮箱地址'),
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
  const info = {
    name: 'caokejian',
    stuId: 2001063037,
    mail: '1'
  }
  try {
    const data = await UserModel.create(info)
    res.status(201).json({ message: '用户创建成功', data: data });
  } catch (error) {
    res.status(500).json({ message: '创建用户失败', error: error.message });
  }
});

module.exports = router;
