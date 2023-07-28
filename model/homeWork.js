const mongoose = require("mongoose")

const WorkType = {
  stuId: Number,
  classId: Number,
  subject: String,
  time: Number,
  title: String,
  content: String,
  file: String||[]
}


const HomeWorkModel = mongoose.model("homeWorl",new mongoose.Schema(WorkType))

module.exports = HomeWorkModel
