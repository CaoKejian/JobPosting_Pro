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
  try {
    const { time, name } = req.query;
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
  try {
    const { classId } = req.query;
    const response = await http.get('/student/habit', { classId })
    res.json(response);
  } catch (error) {
    // console.log(error)
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
  try {
    const { name } = req.query;
    const response = await http.get('/student/subjectscores', { name })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classID}
  * @method 提交类型占比
  * @return {[name:'pdf',bit:0.25]}
*/

router.get('/typebit', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/student/typebit', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classId}
  * @method 个人提交历史监控（分组聚合）
  * @return {[{"subject": [{"name": 'xxx',"bit": 6}]},{"class": [{"id": 123123,"bit": 1}]}]}
*/

router.get('/history', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/teacher/history', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classId}
  * @method 班级、学科提交历史监控(聚类分析)
  * @return {[{"subject": [{"name": 'xxx',"bit": 6}]},{"class": [{"id": 123123,"bit": 1}]}]}
*/

router.get('/history/subject', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/teacher/history/subject', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {stuId:number}
  * @param {stuId}
  * @method 每个同学随着时间逾期次数趋势（时间序列分析）
  * @return {[{is_late:1,time:'2023-09-01'}]}
*/

router.get('/history/tendency', async function (req, res, next) {
  try {
    const { stuId } = req.query;
    const response = await http.get('/teacher/history/tendency', { stuId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classId}
  * @method 每个学科的平均分与难度估测
  * @return {[{subject:'1',average_score:46}]}
*/

router.get('/difficulty', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/teacher/difficulty', { classId })
    res.json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {classId:number}
  * @param {classId}
  * @method 按时提交作业和迟交作业的学生的平均分数是否有显著差异
  * @return {intime:83, overtime: 43}
*/

router.get('/regression', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/teacher/regression', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});


/** 
  * @type {classId:number}
  * @param {classId}
  * @method 完成作业分数与提交时间之间的关系
  * @return {maxtime:9, result: [{data:[{allSubmit:0,score:0,time:'0:00'}]}]}
*/

router.get('/submission', async function (req, res, next) {
  try {
    const { classId } = req.query;
    const response = await http.get('/teacher/submission', { classId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {stuId:number}
  * @param {stuId}
  * @method 完成预测提交作业比率和预测得分
  * @return {maxtime:9, result: [{data:[{allSubmit:0,score:0,time:'0:00'}]}]}
*/

router.get('/complete', async function (req, res, next) {
  try {
    const { stuId } = req.query;
    const response = await http.get('/teacher/complete', { stuId })
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

/** 
  * @type {stuId:number}
  * @param {stuId}
  * @method 学生行为分析和预测引擎（计算准确率、召回率、F1分数）
  * @return {"accuracy": 0.7,"f1_score": 0.8,"recall": 0.8}
*/

router.get('/train', async function (req, res, next) {
  try {
    const response = await http.get('/teacher/train')
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'python request is failed' });
  }
});

module.exports = router;
