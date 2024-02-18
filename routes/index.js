var express = require('express');
const isMock = require('../middleware/isMock');
const ClassInfoModel = require('../model/classInfo');
const UserModel = require('../model/user');
const SubjectModel = require('../model/subject');
const FeedBackModel = require('../model/feedBack');
const mockTime = require('../mailer/mockTime');
const PublishWorkModel = require('../model/publishWork');
const { default: axios } = require('axios');
const DateFn = require('../mailer/date');
const cacheData = require('../Mock/mock.data');
const { MockUser } = require('../mailer/mock');

var router = express.Router();

// 存储mock数据
let mockData = cacheData
mockData.dataLts = 100 // Mock的数据量
router.get('/', isMock, async function (req, res, next) {
  const data = {
    type: 'success',
    dsc: '您已进入Mock环境，此数据非有效数据！',
    data: [`Mock系统已重置，更新时间为${DateFn()}`]
  }
  MockUser() // ***** 初始化Mock用户 *****

  // Mock做初始化处理...
  const protocol = req.protocol;
  const host = req.get('host');
  const url = req.originalUrl;

  const classInfo = `${protocol}://${host}${url}/classInfo` // Mock classInfo
  const user = `${protocol}://${host}${url}/user` // Mock user
  const subject = `${protocol}://${host}${url}/subject` // Mock subject
  const feedback = `${protocol}://${host}${url}/feedback` // Mock feedback
  await axios.get(classInfo)
  await axios.get(user)
  await axios.get(feedback)

  res.status(200).send(data)
});

/* Mock classInfos */
router.get('/classInfo', isMock, async function (req, res, next) {
  await ClassInfoModel.deleteMany()
  // const data = await ClassInfoModel.find()
  // if (data.length !== 0) return res.send('无需重载数据！')
  let obj = []
  for (let i = 0; i < mockData.dataLts; i++) {
    obj[i] = {
      name: mockData.publicName[i],
      stuId: mockData.publicStuid[i],
      classId: mockData.publicClasId[i],
      isAuth: mockData.publicIsAuth[i],
      isRoot: mockData.publicIsRoot[i],
    }
  }
  ClassInfoModel.insertMany(obj)
  res.send('ok')
});

/* Mock users  */
router.get('/user', isMock, async function (req, res, next) {
  await UserModel.deleteMany()
  // const data = await UserModel.find()
  // if (data.length !== 0) return res.send('无需重载数据！')
  let obj = []
  for (let i = 0; i < mockData.dataLts; i++) {
    obj[i] = {
      stuId: mockData.publicStuid[i],
      name: mockData.publicName[i],
      email: mockData.publicEmail[i],
      classId: mockData.publicClasId[i],
      isAuth: mockData.publicIsAuth[i],
      isRoot: mockData.publicIsRoot[i],
    }
  }
  UserModel.insertMany(obj)
  res.send(obj)
});

/* Mock subject  */
router.get('/subject', isMock, async function (req, res, next) {
  await SubjectModel.deleteMany()
  // const data = await UserModel.find()
  // if (data.length !== 0) return res.send('无需重载数据！')
  let obj = []
  for (let i = 0; i < mockData.publicSubject.length; i++) {
    obj[i] = {
      subject: mockData.publicSubject[i],
      classId: mockData.publicClasId[i],
      user: mockData.publicUser[Math.floor(Math.random() * mockData.publicUser.length)],
    }
  }
  SubjectModel.insertMany(obj)
  res.send(obj)
});

/* Mock feedback  */
router.get('/feedback', isMock, async function (req, res, next) {
  await FeedBackModel.deleteMany()
  let obj = []
  for (let i = 0; i < mockData.commendValue.length; i++) {
    obj[i] = {
      stuId: mockData.publicStuid[i],
      name: mockData.publicName[i],
      email: mockData.publicEmail[i],
      feedBackValue: mockData.commendValue[i],
    }
  }
  console.log(obj)
  FeedBackModel.insertMany(obj)
  res.send(obj)
});

/* Mock publishwork */
const subArr = ['高数（1）', 'React', 'Vue3', 'Vue2', '数据挖掘', 'TypeScript', '机器人是什么']
const branchArr = ['完成课后第一单元练习题', '函数式组件学习', 'vue3的v-model与vue2的不同', '插槽是什么？', '完成百度数据采集并且清洗', '了解Ts', '了解chatGpt',]
const contentArr = ['将答案保存到文档里上传。', '了解函数式组件和类组件的区别，优点与不同处。学会编写简单的函数式组件。', '今天必须完成', '了解vue的几种插槽并写出demo', 'python代码上传到班级群', '认识Ts。描述Ts与Js的区别，了解Ts的几大知识点。', '300字文档自己介绍gpt的作用。描述qi',]

router.get('/publishwork', isMock, async function (req, res, next) {
  await PublishWorkModel.deleteMany()
  const user = '曹Sir'
  const classId = 123123
  for (let i = 0; i < 6; i++) {
    PublishWorkModel.create({
      user,
      classId,
      subject: subArr[i],
      branch: branchArr[i],
      contentt: contentArr[i],
      time: mockTime().time,
      cutTime: mockTime().cutTime
    })
  }
  res.send('ok')
})

/* Mock homeWorks */
router.get('/homework', isMock, async function (req, res, next) {

  // res.send(mockName)
})

module.exports = router;
