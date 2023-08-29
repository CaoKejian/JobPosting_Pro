var express = require('express');
const HomeWorkModel = require('../model/homeWork');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const UserModel = require('../model/user');
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

/** 
  * @param {classId,page}
  * @method 查询班级下所有作业
  */

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

/** 
  * @param {stuId}
  * @method 查询某同学所有作业并限制最多5条
  */

router.get('/mywork', async function (req, res) {
  const { stuId } = req.query
  const data = await HomeWorkModel.find({ stuId }).limit(5)
  res.send(data)
})

/** 
  * @param {classId}
  * @method 查询近30天该班级下的所有提交作业
  */

router.get('/classwork', async function (req, res) {
  const { classId } = req.query
  // 获取当前日期的时间戳
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  const data = await HomeWorkModel.find({
    classId,
    timestamp: { $gte: thirtyDaysAgo.getTime() } // 使用$gte操作符来匹配大于等于指定时间戳的文档
  });
  if (data.length === 0) {
    res.status(402).json({ message: '没有相关数据！' })
  }
  res.send(data)
})

/** 
  * @param {id}
  * @method 查询_id的作业
  */

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
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {stuId, branch}
  * @method 查询某同学的某个作业分支的作业信息
  */

router.get('/one', async function (req, res) {
  const { stuId, branch } = req.query
  try {
    const data = await HomeWorkModel.findOne({
      branch,
      stuId: Number(stuId)
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {classId, branch}
  * @method 查询单项作业
  */

router.get('/correct/work', async function (req, res) {
  const { classId, branch } = req.query
  try {
    const data = await HomeWorkModel.find({
      classId,
      branch
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {classId, branch}
  * @method 查询多项作业
  */

router.get('/class/allWork', async function (req, res) {
  const { classId, branch } = req.query
  try {
    const data = await HomeWorkModel.find({
      classId,
      branch
    }).select('stuId classId')
    if (data.length === 0) {
      res.status(402).json({ message: '还没有人提交！' })
    } else {
      res.json(data)
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {_id}
  * @method 删除为_id的作业信息
  */

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

/** 
  * @param {id}
  * @method 查询为id的作业
  */

router.get('/upload/work', async function (req, res) {
  const { id } = req.query
  const data = await HomeWorkModel.findOne({ _id: id })
  if (!data) {
    return res.status(402).json({ message: '未找到相关作业！' });
  } else {
    res.send(data)
  }
})

/** 
  * @param {Work}
  * @method 更新作业、Work所有字段
  */

router.post('/upload', createUserValidationRules, validate, async function (req, res) {
  try {
    const { _id, id, classId, name, stuId, subject, branch, file, content = '', score = 0, tComments = '', favor = false, isPass = false, cutTime = 0, user = '', } = req.body;
    const x = await HomeWorkModel.findById({ _id: id || _id });
    if (!x) {
      return res.status(402).json({ message: '未找到相关作业！' });
    }
    x.classId = classId;
    x.name = name;
    x.stuId = stuId;
    x.subject = subject;
    x.branch = branch;
    x.file = file;
    x.content = content;
    x.score = score;
    x.tComments = tComments;
    x.favor = favor;
    x.isPass = isPass;
    x.cutTime = cutTime;
    x.user = user;
    await x.save();
    res.json(x);
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param { classId, branch, subject}
  * @method （直接下载多项）下载作业
  * @return {{ stuIds, data:{file,stuId} }}
  */

router.get('/download', async function (req, res) {
  try {
    const { classId, branch, subject } = req.query
    const data = await HomeWorkModel.find({
      classId,
      branch,
      subject
    }).select('file stuId')
    if (data) {
      if(data.length === 0){
        const x = await UserModel.find({classId}).select('file stuId')
        const stuIds = x.map(item => item.stuId)
        res.json({stuIds, data})
        return
      }
      const stuIds = data.map(item => item.stuId); // 提取 stuId 到数组
      res.json({ stuIds, data });
    } else {
      res.status(402).json({ message: '未找到相关作业！' })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {stuId, branch}
  * @method （单项）下载作业
  * @return {{ stuIds, data:{file,stuId} }}
  */

router.get('/download/one', async function (req, res) {
  try {
    const { stuId, branch } = req.query
    const data = await HomeWorkModel.findOne({
      stuId: Number(stuId),
      branch,
    }).select('file stuId')
    const stuIds = data.stuId; // 提取 stuId 到数组
    res.json({ stuIds, data })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

/** 
  * @param {Work}
  * @method 上传作业
  */

router.post('/submit', async function (req, res, next) {
  const { classId, name, stuId, subject, branch, file, content, score, tComments, favor, isPass, user, cutTime } = req.body
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
      name,
      stuId,
      subject,
      branch,
      file,
      content,
      score,
      tComments,
      favor,
      isPass,
      user,
      cutTime,
      time: timestamp
    })
    res.status(200).send(data)
  }
});


module.exports = router;
