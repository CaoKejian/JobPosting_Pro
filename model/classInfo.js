const mongoose = require("mongoose")

const ClassInfoType = {
  stuId: Number,
  name: String,
  classId: Number,
  type: Boolean
}


const ClassInfoModel = mongoose.model("classInfo", new mongoose.Schema(ClassInfoType))

module.exports = ClassInfoModel
