// add.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose'); //启动mongodb
var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const HomeWorkModel = require('../../model/homeWork.js');
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

describe('作业', function () {
  it('我的作业', async function () {
    const testData = [
      {  name: '作业1', stuId: '2001063037' },
      {  name: '作业2', stuId: '2001063037' },
      {  name: '作业3', stuId: '2001063037' },
      {  name: '作业4', stuId: '2001063037' },
      {  name: '作业5', stuId: '2001063037' },
      {  name: '作业6', stuId: '2001063037' },
      {  name: '作业7', stuId: '2001063037' },
    ];
    await HomeWorkModel.create(testData);
    const stuId = '2001063037';

    // 发起HTTP请求
    const res = await request(app)
      .get('/api/work/mywork')
      .query({ stuId })
      .expect(200);

    // 断言返回数据
    const data = res.body;
    expect(data).to.be.an('array');
    expect(data).to.have.lengthOf(5);
  });
});