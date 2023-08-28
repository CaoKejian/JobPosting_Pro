const mongoose = require("mongoose")

const FeedBackType = {
  stuId: Number,
  feedBackValue: String,
  email: String,
  name: String
}


const FeedBackModel = mongoose.model("feedBack", new mongoose.Schema(FeedBackType))

module.exports = FeedBackModel
