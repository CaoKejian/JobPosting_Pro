const mongoose = require("mongoose")

const FeedBackType = {
  stuId: Number,
  content: String
}


const FeedBackModel = mongoose.model("feedBack", new mongoose.Schema(FeedBackType))

module.exports = FeedBackModel
