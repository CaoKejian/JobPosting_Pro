const mongoose = require("mongoose")

const SubjectType = {
  subject: String,
  classId: Number,
  user: String
}


const SubjectModel = mongoose.model("subject", new mongoose.Schema(SubjectType))

module.exports = SubjectModel
