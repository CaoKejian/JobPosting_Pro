var express = require('express');
const HomeWorkModel = require('../model/homeWork');
var router = express.Router();

/* GET home page. */
router.post('/submit', async function (req, res, next) {
  const { classId, stuId, subject, branch, file } = req.body
  const timestamp = Date.now();
  const isHave = await HomeWorkModel.find({
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
      time: timestamp
    })
    console.log(data);
    res.status(200).send(data)
  }

});


module.exports = router;
