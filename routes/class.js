var express = require('express');
const UserModel = require('../model/user');
const ClassInfoModel = require('../model/classInfo');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { classId } = req.query
  try {
    const data = await ClassInfoModel.find({
      classId
    })
    if (data.length === 0) {
      return res.status(402).send({ message: '该班级下没有同学' })
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
  // res.send({ok: 1})
});
const usersToInsert = [
  { stuId: 2001063037, name: '曹珂俭', classId: 123123 },
  { stuId: 2001062028, name: '黄梦瑶', classId: 123123 },
  { stuId: 2001062036, name: '蔡奇奇', classId: 123123 },
  { stuId: 2001062011, name: '捏于波', classId: 123123 },
  { stuId: 2001040023, name: '李梓良', classId: 123123 },
  { stuId: 2001063036, name: '张博涵', classId: 123123 },
  { stuId: 2001062067, name: '王硕', classId: 123123 },
];

router.get('/insert/info', async function(req,res){
  const data = await ClassInfoModel.insertMany(usersToInsert)
  res.send(data)
})
router.get('/insert/delete', async function(req,res){
  const data =await ClassInfoModel.deleteMany({})
  res.send(data)
})

module.exports = router;
