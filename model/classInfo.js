const mongoose = require("mongoose")

const ClassInfoType = {
  stuId: Number,
  name: String,
  classId: Number
}


const ClassInfoModel = mongoose.model("classInfo", new mongoose.Schema(ClassInfoType))

module.exports = ClassInfoModel
