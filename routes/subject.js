var express = require('express');
const SubjectModel = require('../model/subject');

var router = express.Router();

/* GET home page. */
router.post('/', async function (req, res, next) {
  const { subject, classId, user } = req.body
  const isHave = await SubjectModel.find({
    subject,
    classId
  })
  if (isHave.length !== 0) {
    return res.status(402).json({ message: '已存在该学科！' })
  }
  const data = await SubjectModel.create({
    subject,
    classId,
    user
  })
  res.status(200).send(data)
});
router.get('/myclass', async function (req, res) {
  const { user } = req.query
  const data = await SubjectModel.find({ user })
  if (data.length === 0) {
    res.status(402).json({ message: '需要发布作业才能关联班级！' })
  } else {
    const classIds = new Set();
    const subjects = new Set()
    data.forEach(item => {
      classIds.add(item.classId);
      subjects.add(item.subject);
    });
    res.json({ classes: [...classIds], subjects: [...subjects] });
  }
})
router.get('/myclass/classId', async function (req, res) {
  const { classId } = req.query
  const data = await SubjectModel.find({ classId })
  if (data.length === 0) {
    res.status(402).json({ message: '没有相关作业发布！' })
  } else {
    const subjects = new Set()
    data.forEach(item => {
      subjects.add(item.subject);
    });
    res.send({subjects: [...subjects]})
  }
})
router.get('/myclass/work', async function (req, res) {
  const { user, classId, subject } = req.query
  const data = await SubjectModel.find({ user, classId, subject })
  if (data.length === 0) {
    res.status(402).json({ message: '没有相关作业发布！' })
  } else {
    res.send(data)
  }
})

module.exports = router;
