var express = require('express');
const PublishWorkModel = require('../model/publishWork');

var router = express.Router();

/** 
  * @param {Work}
  * @method 发布作业
  */

router.post('/', async function (req, res, next) {
  try {
    const { user,
      classId,
      subject,
      branch,
      cutTime,
      content, } = req.body
    const isHave = await PublishWorkModel.find({
      classId, branch, subject
    })
    if (isHave.length !== 0) {
      return res.status(402).json({ message: '已发布该作业！' })
    }
    codeTimestamp = Date.now();
    const data = await PublishWorkModel.create({
      user,
      classId,
      subject,
      branch,
      time: codeTimestamp,
      cutTime, //截止时间
      content,
    })
    res.send(data)
  } catch (err) {
    res.status(500).json({ message: '服务器错误' })
  }
});

/**
 * @type
 * @按班级查询
 * @按老师查询
 * @按学科查询
 * @按分支查询
 * */

/** 
  * @param {classId}
  * @method 按班级查询
  */

router.get('/class', async function (req, res) {
  try {
    const { classId } = req.query
    const data = await PublishWorkModel.find({ classId })
    if (data) {
      res.send(data)
    } else {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器错误' })
  }
})

/** 
  * @param {user, classId}
  * @method 查询个人发布在某班级下的所有学科
  */

router.get('/user', async function (req, res) {
  try {
    const { user, classId } = req.query
    const data = await PublishWorkModel.find({ user, classId })
    if (data) {
      res.send(data)
    } else if (data.length === 0) {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器错误' })
  }
})

/** 
  * @param {subject}
  * @method 按学科查询
  */

router.get('/subject', async function (req, res) {
  try {
    const { subject } = req.query
    const data = await PublishWorkModel.find({ subject })
    if (data) {
      res.send(data)
    } else {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器错误' })
  }
})

/** 
  * @param {branch, subject, classId}
  * @method 查询此班级、此学科、此分支的所有作业
  */

router.get('/branch', async function (req, res) {
  try {
    const { branch, subject, classId } = req.query
    const data = await PublishWorkModel.findOne({ branch, subject, classId })
    if (data) {
      res.send(data)
    } else {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器内部错误！' });
  }
})

/** 
  * @param {subject}
  * @method 查询此学科下的所有分支
  */

router.get('/subject/branch', async function (req, res) {
  try {
    const { subject } = req.query
    const data = await PublishWorkModel.find({ subject })
    if (data) {
      const branches = new Set()
      data.forEach(item => {
        branches.add(item.branch);
      });
      res.send({ branches: [...branches] })
    } else {
      res.status(402).json({ message: '没有相关信息！' })
    }
  } catch (err) {
    res.status(500).json({ message: '服务器内部错误！' });
  }
})

/** 
  * @param {classId,branch}
  * @method 查询此分支的作业详情
  */

router.get('/subject/branch/info', async function (req, res) {
  try {
    const { classId, branch } = req.query
    const data = await PublishWorkModel.findOne({ classId, branch })
    res.send(data)
  } catch (err) {
    res.status(500).json({ message: '服务器内部错误！' });
  }
})
module.exports = router;
