var express = require('express');
const HomeWorkModel = require('../model/homeWork');
var router = express.Router();
const { check, validationResult } = require('express-validator');
// 定义数据验证规则
const createUserValidationRules = [
  check('classId').notEmpty().withMessage('班级码不能为空'),
  check('stuId').notEmpty().withMessage('学号不能为空'),
  check('subject').notEmpty().withMessage('学科不能为空'),
  check('branch').notEmpty().withMessage('作业分支不能为空'),
  check('file').custom((value, { req }) => {
    if (!value) {
      throw new Error('上传文件不能为空');
    }
    return true;
  }),
  check('stuId').notEmpty().withMessage('学号不能为空'),
  check('stuId').notEmpty().withMessage('学号不能为空'),
];
// 中间件，用于处理数据验证
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.get('/', async function (req, res) {
  const { classId, page } = req.query
  try {
    const limitNumber = 5
    const skip = (page - 1) * limitNumber;
    const totalDocuments = await HomeWorkModel.countDocuments({ classId: Number(classId) });
    const data = await HomeWorkModel.find({ classId: Number(classId) }).skip(skip).limit(limitNumber)
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
    res.status(500).json({
      code: 500,
      message: '查询失败',
    });
  }
})
router.get('/mywork', async function (req, res) {
  const { stuId } = req.query
  const data = await HomeWorkModel.find({ stuId }).limit(5)
  res.send(data)
})
router.get('/otherwork', async function (req, res) {
  try {
    const { id } = req.query
    const data = await HomeWorkModel.findOne({ _id: id })
    if (data) {
      res.json(data)
    } else {
      res.status(402).json({ message: '未找到相关信息！' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

router.post('/delete', async function (req, res) {
  try {
    const { _id } = req.body
    const data = await HomeWorkModel.deleteOne({ _id })
    if (data) {
      res.json({ message: '删除成功！' })
    } else {
      res.status(402).json({ message: '未找到相关作业！' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

router.get('/upload/work', async function (req, res) {
  const { id } = req.query
  const data = await HomeWorkModel.findOne({ _id: id })
  if (!data) {
    return res.status(402).json({ message: '未找到相关作业！' });
  } else {
    res.send(data)
  }
})
router.post('/upload', createUserValidationRules, validate, async function (req, res) {
  try {
    const { id, classId, stuId, subject, branch, file, content = '', score = 0, tComments = '', favor = false, isPass = false } = req.body;
    const x = await HomeWorkModel.findById({ _id: id });
    if (!x) {
      return res.status(402).json({ message: '未找到相关作业！' });
    }
    x.classId = classId;
    x.stuId = stuId;
    x.subject = subject;
    x.branch = branch;
    x.file = file;
    x.content = content;
    x.score = score;
    x.tComments = tComments;
    x.favor = favor;
    x.isPass = isPass;
    await x.save();
    res.json(x);
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})
router.get('/download', async function (req, res) {
  try {
    const { classId, branch, subject } = req.query
    const data = await HomeWorkModel.find({
      classId,
      branch,
      subject
    }).select('file stuId')
    if (data) {
      const stuIds = data.map(item => item.stuId); // 提取 stuId 到数组
      res.json({ stuIds, data });
    } else {
      res.status(402).json({ message: '未找到相关作业！' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})
router.get('/download/one', async function (req, res) {
  try {
    const { stuId, branch } = req.query
    console.log(stuId,branch)
    const data = await HomeWorkModel.findOne({
      stuId: Number(stuId),
      branch,
    }).select('file stuId')
    console.log(data)
    const stuIds = data.stuId; // 提取 stuId 到数组
    res.json({stuIds,data})
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})
/* GET home page. */
router.post('/submit', async function (req, res, next) {
  const { classId, stuId, subject, branch, file, content, score, tComments, favor, isPass } = req.body
  console.log(classId, stuId, subject, branch, file, content, score, tComments, favor, isPass)
  const timestamp = Date.now();
  const isHave = await HomeWorkModel.find({
    stuId,
    classId: classId,
    branch: branch
  })
  if (isHave.length !== 0) {
    return res.status(402).json({ message: '不要重复上传' })
  } else {
    const data = await HomeWorkModel.create({
      classId,
      stuId,
      subject,
      branch,
      file,
      content,
      score,
      tComments,
      favor,
      isPass,
      time: timestamp
    })
    res.status(200).send(data)
  }
});


module.exports = router;
