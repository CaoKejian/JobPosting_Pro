var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { user,
    classId,
    subject,
    branch,
    cutTime,
    content, } = req.query
  codeTimestamp = Date.now();
  const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; 
  // const cutTime = codeTimestamp + twoDaysInMillis;
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


module.exports = router;
