const mongoose = require("mongoose")

const WorkType = {
  stuId: Number,
  classId: Number,
  subject: String,
  time: Number,
  branch: String,
  file: {}
}

const HomeWorkModel = mongoose.model("homeWork",new mongoose.Schema(WorkType))

module.exports = HomeWorkModel
