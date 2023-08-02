var express = require('express');
const HomeWorkModel = require('../model/homeWork');
var router = express.Router();

router.get('/', async function (req, res) {
  const { classId, page } = req.query
  try {
    const limitNumber = 5
    const skip = (page - 1) * limitNumber;
    const totalDocuments = await HomeWorkModel.countDocuments({ classId });
    const data = await HomeWorkModel.find({ classId }).skip(skip).limit(limitNumber)
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
})
router.get('/mywork', async function (req, res) {
  const { stuId } = req.query
  const data = await HomeWorkModel.find({ stuId })
  res.send(data)
})
router.get('/otherwork', async function (req, res) {
  const { _id } = req.body

})
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
