var express = require('express');
const SubjectModel = require('../model/subject');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { subject, classId } = req.query
  const isHave = await SubjectModel.find({
    subject,
    classId
  })
  if(isHave.length!==0){
    return res.status(402).json({ message: '已存在该学科！' })
  }
  const data = await SubjectModel.create({
    subject: subject,
    classId: classId
  })
  res.status(200).send(data)
});


module.exports = router;
