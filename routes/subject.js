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
    data.forEach(item => {
      classIds.add(item.classId);
    });
    res.json({ classes: [...classIds] });
  }
})

module.exports = router;
