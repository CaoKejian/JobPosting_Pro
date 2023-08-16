var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const data = await PublishWorkModel.find()
  res.send(data)
});


module.exports = router;
