const mongoose = require("mongoose")

const SubjectType = {
  subject: String,
  classId: Number
}


const SubjectModel = mongoose.model("subject", new mongoose.Schema(SubjectType))

module.exports = SubjectModel
