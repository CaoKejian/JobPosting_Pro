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

var router = express.Router();

router.get('/', isMock, async function (req, res, next) {
  const data = {
    type: 'success',
    dsc: '您已进入Mock环境，此数据非有效数据！',
    data: [`Mock系统已重置，更新时间为${DateFn()}`]
  }
  // Mock做初始化处理...
  const protocol = req.protocol;
  const host = req.get('host');
  const url = req.originalUrl;

  const publishWork = `${protocol}://${host}${url}publishwork` // Mock publishWork

  await axios.get(publishWork)

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

/* Mock subject  */
router.get('/subject', isMock, async function (req, res, next) {
  // const data = [
  //   { subject: "高数（1）", classId: 123123, user: "曹Sir" },
  //   { subject: "React", classId: 123123, user: "曹Sir" },
  //   { subject: "数据挖掘", classId: 123123, user: "曹Sir" },
  //   { subject: "Vue3", classId: 123123, user: "曹Sir" },
  //   { subject: "TypeScript", classId: 123123, user: "曹Sir" },
  //   { subject: "Vue2", classId: 123123, user: "曹Sir" },
  //   { subject: "机器人是什么", classId: 122122, user: "曹Sir"}
  // ]
  // const x = SubjectModel.insertMany(data)
  // res.status(200).send(x)
});

/* Mock feedback  */
router.get('/feedback', isMock, async function (req, res, next) {
  // const data = [
  //   { "stuId": 2001063037, feedBackValue: "沙发a~", email: "1849201815@qq.com", name: "曹珂俭", },
  //   { "stuId": 2001063037, feedBackValue: "沙发2~", email: "1849201815@qq.com", name: "黄梦瑶", },
  //   { "stuId": 2001063037, feedBackValue: "学生系统统计图表不美观", email: "1849201815@qq.com", name: "李梓良", },
  //   { "stuId": 2001063037, feedBackValue: "教师里输入框样式不统一", email: "1849201815@qq.com", name: "蔡齐齐", },
  //   { "stuId": 2001063037, feedBackValue: "做的不错 继续更新", email: "1849201815@qq.com", name: "张博涵", },
  //   { "stuId": 2001063037, feedBackValue: "加油加油！", email: "1849201815@qq.com", name: "聂宇博", },
  //   { "stuId": 2001063037, feedBackValue: "这个折线图真piu亮啊！！！", email: "1849201815@qq.com", name: "王硕", },
  //   { "stuId": 2001, feedBackValue: "colin同学数据作业完成的不错！", email: "caokejian@foxmail.com", name: "曹Sir", },
  //   { "stuId": 2001, feedBackValue: "牛", email: "caokejian@foxmail.com", name: "李梓良", },
  //   { "stuId": 2001, feedBackValue: "你真帅！", email: "caokejian@foxmail.com", name: "张博涵", },
  //   { "stuId": 2001, feedBackValue: "这次更新不错", email: "caokejian@foxmail.com", name: "曹Sir", },
  //   { "stuId": 2001, feedBackValue: "4", email: "caokejian@foxmail.com", name: "张博涵", },
  //   { "stuId": 2001, feedBackValue: "666~", email: "caokejian@foxmail.com", name: "曹Sir", },
  //   { "stuId": 2001, feedBackValue: "6", email: "caokejian@foxmail.com", name: "蔡齐齐", },
  //   { "stuId": 2001, feedBackValue: "我是大学生，能免费使用吗", email: "caokejian@foxmail.com", name: "王硕", },
  //   { "stuId": 2001, feedBackValue: "我是小傻瓜~", email: "caokejian@foxmail.com", name: "聂宇博", },
  //   { "stuId": 2001, feedBackValue: "楼上真帅！", email: "caokejian@foxmail.com", name: "曹Sir", },
  // ]
  // const x = FeedBackModel.insertMany(data)
  // res.status(200).send(x)
});

/* Mock publishwork */

router.get('/publishwork', isMock, async function (req, res, next) {
  await PublishWorkModel.deleteMany()
  const user = '曹Sir'
  const classId = 123123
  const subArr = ['高数（1）', 'React', 'Vue3', 'Vue2', '数据挖掘', 'TypeScript', '机器人是什么']
  const branchArr = ['完成课后第一单元练习题', '函数式组件学习', 'vue3的v-model与vue2的不同', '插槽是什么？', '完成百度数据采集并且清洗', '了解Ts', '了解chatGpt',]
  const contentArr = ['将答案保存到文档里上传。', '了解函数式组件和类组件的区别，优点与不同处。学会编写简单的函数式组件。', '今天必须完成', '了解vue的几种插槽并写出demo', 'python代码上传到班级群', '认识Ts。描述Ts与Js的区别，了解Ts的几大知识点。', '300字文档自己介绍gpt的作用。描述qi',]
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
module.exports = router;
