var express = require('express');
const http = require('../service/service');
var router = express.Router();

/** 
  * @type {time:string['YY-MM-DD'], name:string}
  * @param {time, name}
  * @method 作业提交周频率
  * @return {[{day:'', week:3}]}
  */

router.get('/week/frequency', async function (req, res, next) {
  const { time, name } = req.query;
  const apiUrl = `http://127.0.0.1:3001/student/week`;
  try {
    const response = await http.get(apiUrl, { time, name })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {name:string}
  * @param {name}
  * @method 平均分及擅长方向
  * @return {[{subject:'数据挖掘', average:90}]}
  */

router.get('/average', async function (req, res, next) {
  const { name } = req.query;
  const apiUrl = `http://127.0.0.1:3001/student/average`;
  try {
    const response = await http.get(apiUrl, { name })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

module.exports = router;
