const mongoose = require("mongoose")

const tableName = process.env.NODE_DATA === 'mock' ? 'mock' : 'jobpost'
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:27017/${tableName}`)

mongoose.connection.on("open", () => {
  console.log('\x1b[33m%s\x1b[0m', '数据库 已成功连接！')
  console.log('\x1b[33m%s\x1b[0m', `当前连接表：${tableName}`)
  // 在这里可以执行其他操作
});

// 监听连接错误事件
mongoose.connection.on("error", (err) => {
  console.error("MongoDB 连接错误:", err);
});