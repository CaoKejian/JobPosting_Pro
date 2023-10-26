var express = require('express');
const MockModel = require('../model/mock');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const data = {
    code: 200,
    message: '你好，express'
  }
  // MockModel
  res.status(200).send(data)
});


module.exports = router;
