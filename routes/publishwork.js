var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/** 
  * @param {Work}
  * @method 发布作业
  */

router.post('/', async function (req, res, next) {
  const { user,
    classId,
    subject,
    branch,
    cutTime,
    content, } = req.body
  const isHave = await PublishWorkModel.find({
    classId, branch, subject
  })
  if (isHave.length !== 0) {
    return res.status(402).json({ message: '已发布该作业！' })
  }
  codeTimestamp = Date.now();
  const data = await PublishWorkModel.create({
    user,
    classId,
    subject,
    branch,
    time: codeTimestamp,
    cutTime, //截止时间
    content,
  })
  res.send(data)
});

/**
 * @type
 * @按班级查询
 * @按老师查询
 * @按学科查询
 * @按分支查询
 * */

/** 
  * @param {classId}
  * @method 按班级查询
  */

router.get('/class', async function (req, res) {
  const { classId } = req.query
  const data = await PublishWorkModel.find({ classId })
  if (data) {
    res.send(data)
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})

/** 
  * @param {user}
  * @method 按个人查询
  */

router.get('/user', async function (req, res) {
  const { user } = req.query
  const data = await PublishWorkModel.find({ user })
  if (data) {
    res.send(data)
  } else if (data.length === 0) {
    res.status(402).json({ message: '没有相关信息！' })
  }
})

/** 
  * @param {subject}
  * @method 按学科查询
  */

router.get('/subject', async function (req, res) {
  const { subject } = req.query
  const data = await PublishWorkModel.find({ subject })
  if (data) {
    res.send(data)
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})

/** 
  * @param {branch, subject, classId}
  * @method 查询此班级、此学科、此分支的所有作业
  */

router.get('/branch', async function (req, res) {
  const { branch, subject, classId } = req.query
  try {
    const data = await PublishWorkModel.findOne({ branch, subject, classId })
    if (data) {
      res.send(data)
    } else {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器内部错误！' });
  }
})

/** 
  * @param {subject}
  * @method 查询此学科下的所有分支
  */

router.get('/subject/branch', async function (req, res) {
  const { subject } = req.query
  const data = await PublishWorkModel.find({ subject })
  if (data) {
    const branches = new Set()
    data.forEach(item => {
      branches.add(item.branch);
    });
    res.send({ branches: [...branches] })
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})

module.exports = router;
