const mongoose = require("mongoose")

const UserType = {
  stuId: Number,
  email: String
}


const UserModel = mongoose.model("user",new mongoose.Schema(UserType))

module.exports = UserModel
