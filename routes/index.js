var express = require('express');
const isMock = require('../middleware/isMock');
const ClassInfoModel = require('../model/classInfo');
const UserModel = require('../model/user');

var router = express.Router();

router.get('/', isMock, async function (req, res, next) {
  const data = {
    type: 'success',
    dsc: '您已进入Mock环境，此数据非有效数据！',
    data: []
  }
  res.status(200).send(data)
});

/* Mock classInfos  */
router.get('/classInfo', isMock, async function (req, res, next) {
  // const data = [{ stuId: 2001063037, name: '曹珂俭', classId: 123123, isAuth: true, isRoot: true },
  // { stuId: 2001062028, name: '黄梦瑶', classId: 123123, isAuth: true, isRoot: false },
  // { stuId: 2001062036, name: '蔡奇奇', classId: 123123, isAuth: false },
  // { stuId: 2001062011, name: '捏于波', classId: 123123, isAuth: false },
  // { stuId: 2001040023, name: '李梓良', classId: 123123, isAuth: false },
  // { stuId: 2001063036, name: '张博涵', classId: 123123, isAuth: false, isRoot: false },
  // { stuId: 2001062067, name: '王硕', classId: 123123, isAuth: false },
  // { stuId: 2001, name: '曹Sir', type: true, isAuth: true, isRoot: true }]
  // const x = await ClassInfoModel.insertMany(data)
  // res.status(200).send(x)
});


/* Mock users  */
router.get('/user', isMock, async function (req, res, next) {
  // const data = [{ stuId: 2001063037, email: "caokejian@foxmail.com", classId: 123123, name: "曹珂俭", isAuth: true, isRoot: true },
  // { stuId: 2001062067, email: "3192410351@qq.com", classId: 123123, name: "王硕", isAuth: false, isRoot: false },
  // { stuId: 2001062036, email: "515694789@qq.com", classId: 123123, name: "蔡奇奇", isAuth: false, isRoot: false },
  // { stuId: 2001040023, email: "2256876027@qq.com", classId: 123123, name: "李梓良", isAuth: false, isRoot: false },
  // { stuId: 2001062011, email: "971602307@qq.com", classId: 123123, name: "聂宇博", isAuth: false, isRoot: false },
  // { stuId: 2001063036, email: "770527697@qq.com", classId: 123123, name: "张博涵", isAuth: false, isRoot: false },
  // { stuId: 2001, email: "caokejian@foxmail.com", name: "曹Sir", isAuth: true, isRoot: true },
  // { "stuId": 2001062028, email: "2594838054@qqcom", name: "黄梦瑶", classId: 123123, isAuth: true, isRoot: false }]
  // const x = UserModel.insertMany(data)
  // res.status(200).send(x)
});

module.exports = router;
