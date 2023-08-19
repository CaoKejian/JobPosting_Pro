const mongoose = require("mongoose")

const WorkType = {
  stuId: Number,
  classId: Number,
  subject: String,
  time: Number,
  branch: String,
  favor: Boolean, //优秀作品
  content:String, // 作业描述，用于详细说明作业要求和内容。
  score: Number, // 得分
  tComments: String, // 教师评语
  isPass:Boolean,// 已评
  user: String,
  curTime: Number,
  file: {}
}

const HomeWorkModel = mongoose.model("homeWork",new mongoose.Schema(WorkType))

module.exports = HomeWorkModel
