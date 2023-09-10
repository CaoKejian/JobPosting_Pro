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
  try {
    const response = await http.get('/student/week', { time, name })
    res.json(response);
  } catch (error) {
    console.log(error)
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
  try {
    const response = await http.get('/student/average', { name })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classId}
  * @method 个人提交习惯
  * @return {[{ cluster_centers:[
  *   [ 1,0 ], [0.75,0.25]],
  *   file_types:['docx', 'jpeg'],
  *   student_labels:{name1:1,name2:0} 
  * }]}
  */

router.get('/habit', async function (req, res, next) {
  const { classId } = req.query;
  try {
    const response = await http.get('/student/habit', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {name:string}
  * @param {name}
  * @method 学科之间的相关性
  * @return {{学科1:{
  *   学科2:0.34, 学科3:0.56
  * }},{学科2:{
*   学科1:0.24, 学科3:0.56,
* }}}
*/

router.get('/subjectscores', async function (req, res, next) {
  const { name } = req.query;
  try {
    const response = await http.get('/student/subjectscores', { name })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});
module.exports = router;
