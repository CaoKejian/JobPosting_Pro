var express = require('express');
const HomeWorkModel = require('../model/homeWork');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const x = await HomeWorkModel.find({
    time:1691228604827
  }).lean()
  const data = {
    code: 200,
    message: '你好，express'
  }
  res.status(200).send(x)
});


module.exports = router;
