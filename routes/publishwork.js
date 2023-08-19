var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/* GET home page. */
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
 * 查询：
 * @按班级查询
 * @按老师查询
 * @按学科查询
 * */
router.get('/class', async function (req, res) {
  const { classId } = req.query
  const data = await PublishWorkModel.find({ classId })
  if (data) {
    res.send(data)
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})
router.get('/user', async function (req, res) {
  const { user } = req.query
  const data = await PublishWorkModel.find({ user })
  if (data) {
    res.send(data)
  } else if (data.length === 0) {
    res.status(402).json({ message: '没有相关信息！' })
  }
})
router.get('/subject', async function (req, res) {
  const { subject } = req.query
  const data = await PublishWorkModel.find({ subject })
  if (data) {
    res.send(data)
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})
router.get('/branch', async function (req, res) {
  const { branch } = req.query
  const data = await PublishWorkModel.find({ branch })
  if (data) {
    res.send(data)
  } else {
    res.status(402).json({ message: '没有相关信息！' })
  }
})
module.exports = router;
