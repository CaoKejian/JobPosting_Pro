const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose'); //启动mongodb
var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const UserModel = require('../../model/user.js');
chai.use(chaiHttp);
const expect = chai.expect;

// 启动测试数据库
let mongoServer;
before(async function () {
  mongoServer = new MongoMemoryServer();
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

describe('班级信息', function(){
  it('查询相关同学', async function() {
    const textData = [
      {stuId:123,classId:123123},
      {stuId:111,classId:123123},
      {stuId:222,classId:111},
    ]
    await UserModel.insertMany(textData)
    const classId = 123123
    const res = await request(app)
      .get('/api/class')
      .query({classId})
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(2)
  })
  it('查询空判断', async function() {
    const textData = [
      {stuId:123,classId:123123},
      {stuId:111,classId:123123},
    ]
    await UserModel.insertMany(textData)
    const classId = 1111111
    const res = await request(app)
      .get('/api/class')
      .query({classId})
      .expect(200)
    const data = res.body
    expect(data.message).to.equal('改班级下没有同学')
  })
})