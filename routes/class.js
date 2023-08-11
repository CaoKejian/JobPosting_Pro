var express = require('express');
const UserModel = require('../model/user');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const {classId} = req.query
  try{
    const data = await UserModel.find({
      classId
    })
    if(data.length===0){
      res.status(200).send({message:'该班级下没有同学'})
    }
    res.status(200).send(data)
  }catch(error){
    res.status(500).json({message: '服务器出错！'})
  }
  
});


module.exports = router;
