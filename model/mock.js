const mongoose = require("mongoose")

const MockType = {
  user: String,
  classId: Number,
  subject: String,
  branch: String,
  time: Number,
  cutTime: Number, //截止时间
  content: String, // 作业描述，用于详细说明作业要求和内容。
}

const MockModel = mongoose.model("mock", new mongoose.Schema(MockType))

module.exports = MockModel
