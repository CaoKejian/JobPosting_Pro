const mongoose = require("mongoose")

const UserType = {
  name:String,
  stuId: Number,
  mail: String
}


const UserModel = mongoose.model("user",new mongoose.Schema(UserType))

module.exports = UserModel
