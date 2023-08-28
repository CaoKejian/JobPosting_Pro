var express = require('express');
const FeedBackModel = require('../model/feedBack');
const { ThanksMail } = require('../mailer');

var router = express.Router();

/** 
  * @method 查询反馈总量
  */

router.get('/', async function (req, res, next) {
  try {
    const data = await FeedBackModel.find({})
    res.send(data)
  } catch (err) {
    res.status(500).send({ message: '服务器出错！', err })
  }
});

/** 
  * @type {form:{stuId,name,email,content}}
  * @param {form}
  * @method 提交反馈
  */

router.post('/submit', async function (req, res, next) {
  try {
    const { stuId, name, email, content } = req.body
    if (content === '') {
      return res.status(400).json({ message: '反馈不能为空！' })
    }
    const data = await FeedBackModel.create({
      stuId, name, email, content
    })
    ThanksMail.sendMail(email, name, (state) => {
      if (state) {
        return res.status(200).json(data(200, {}))
      } else {
        return res.status(400).json(data(400, {}, '发送失败'))
      }
    })
    res.send(data)
  } catch (err) {
    res.status(500).send({ message: '服务器出错！', err })
  }
});
module.exports = router;
