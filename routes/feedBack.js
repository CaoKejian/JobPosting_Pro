var express = require('express');
const FeedBackModel = require('../model/feedBack');
const Email = require('../mailer/index');

var router = express.Router();

/** 
  * @param {page}
  * @method 查询反馈总量
  */

router.get('/', async function (req, res, next) {
  const { page } = req.query
  try {
    const limitNumber = 16
    const skip = (page - 1) * limitNumber;
    const totalDocuments = await FeedBackModel.countDocuments({});
    const data = await FeedBackModel.find({}).skip(skip).limit(limitNumber)
    // 计算总页数
    const totalPages = Math.ceil(totalDocuments / limitNumber);
    res.json({
      code: 200,
      message: '查询成功',
      data,
      pagination: {
        total: totalDocuments,
        currentPage: page,
        totalPages,
        perPage: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '查询失败',
    });
  }
});

/** 
  * @type {form:{stuId,name,email,feedBackValue}}
  * @param {form}
  * @method 提交反馈
  */

router.post('/submit', async function (req, res, next) {
  try {
    const { form } = req.body
    const { email, name, stuId, feedBackValue } = form
    if (feedBackValue === '') {
      return res.status(400).json({ message: '反馈不能为空！' })
    }
    const data = await FeedBackModel.create({
      stuId: +stuId, name, email, feedBackValue
    })
    Email.ThanksMail(email, name, (state) => {
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
