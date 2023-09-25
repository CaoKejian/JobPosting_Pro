var express = require('express');
const ClassInfoModel = require('../model/classInfo');
const UserModel = require('../model/user');
const http = require('../service/service');

var router = express.Router();

/** 
  * @param {}
  * @method 查询录入的所有同学信息
  */

router.get('/all', async function (req, res, next) {
  try {
    const data = await ClassInfoModel.find()
    res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
});

/** 
  * @param {classId}
  * @method 查询此班级下的所有同学信息
  */

router.get('/', async function (req, res, next) {
  const { classId } = req.query
  try {
    const data = await ClassInfoModel.find({
      classId
    })
    if (data.length === 0) {
      return res.status(200).send({ message: '该班级下没有同学' })
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
});

/** 
  * @param {stuId }
  * @method 查询姓名和邮箱
  */

router.get('/stuid/name', async function (req, res) {
  try {
    const { stuId } = req.query
    const data = await ClassInfoModel.findOne({ stuId });
    if (data) {
      const info = await UserModel.findOne({ stuId }).select('email')
      if (!info) {
        return res.json({ name: data.name, email: '' })
      }
      res.json({ name: data.name, email: info.email });
    } else {
      res.json({ name: '', email: '' })
    }
  } catch (error) {
    res.status(500).json({ message: '服务器出错！' })
  }
})

const usersToInsert = [
  { stuId: 2001063037, name: '曹珂俭', classId: 123123, type: true },
  { stuId: 2001062028, name: '黄梦瑶', classId: 123123, type: true },
  { stuId: 2001062036, name: '蔡奇奇', classId: 123123, type: true },
  { stuId: 2001062011, name: '捏于波', classId: 123123, type: true },
  { stuId: 2001040023, name: '李梓良', classId: 123123, type: true },
  { stuId: 2001063036, name: '张博涵', classId: 123123, type: true },
  { stuId: 2001062067, name: '王硕', classId: 123123, type: true },
];

/** 
  * @param {stuId, name, classId, type = false }
  * @method 新增人员
  */

router.post('/insert', async function (req, res) {
  const { stuId, name, classId, isAuth = false } = req.body
  try {
    const existingRecord = await ClassInfoModel.findOne({ stuId: stuId });
    if (existingRecord) {
      return res.status(200).json({ message: '成员信息已存在！' });
    }
    const data = await ClassInfoModel.create({
      stuId,
      name,
      classId,
      isAuth
    });
    res.status(200).json({ message: '成员信息添加成功！', data: data });
  } catch (error) {
    res.status(500).json({ message: '创建用户失败', error: error.message });
  }
})

/** 
  * @type {url:xlsx类型文件地址 }
  * @param {url:string }
  * @method 批量新增人员
  * @return {{data:'success',repeat:[{stuId:111,name:'xxx'}]}}
  */

router.post('/insertall', async function (req, res) {
  const { url } = req.body
  try {
    const response = await http.post('/insert', { url })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
})


router.get('/insert/info', async function (req, res) {
  const data = await ClassInfoModel.insertMany(usersToInsert)
  res.send(data)
})
router.get('/insert/delete', async function (req, res) {
  const data = await ClassInfoModel.deleteMany({})
  res.send(data)
})

module.exports = router;
