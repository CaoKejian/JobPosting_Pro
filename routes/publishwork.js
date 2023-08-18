var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { body } = req.query
  codeTimestamp = Date.now();
  const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; 
  const endTime = codeTimestamp + twoDaysInMillis;
  const data = await PublishWorkModel.create(body)
  // const data = await PublishWorkModel.create({
  //   user: '嘿老师',
  //   classId: 123123,
  //   subject: '高数二',
  //   branch: '积分',
  //   time: codeTimestamp,
  //   cutTime: endTime, //截止时间
  //   content: '预习积分，完成第二章课后题T32.',
  // })
  res.send(data)
});

module.exports = router;
