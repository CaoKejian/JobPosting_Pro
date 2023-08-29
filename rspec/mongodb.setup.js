/* 
  * mongodb测试启动文件
*/

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const mongoServer = new MongoMemoryServer();

before(async function () {
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});
