const mongoose = require("mongoose")

const PublishWorkType = {
  user: String,
  classId: Number,
  subject: String,
  branch: String,
  time: Number,
  cutTime: Number, //截止时间
  content: String, // 作业描述，用于详细说明作业要求和内容。
}

const PublishWorkModel = mongoose.model("publishWork", new mongoose.Schema(PublishWorkType))

module.exports = PublishWorkModel
