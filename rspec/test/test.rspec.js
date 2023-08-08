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
      { name: '作业1', stuId: '2001063037' },
      { name: '作业2', stuId: '2001063037' },
      { name: '作业3', stuId: '2001063037' },
      { name: '作业4', stuId: '2001063037' },
      { name: '作业5', stuId: '2001063037' },
      { name: '作业6', stuId: '2001063037' },
      { name: '作业7', stuId: '2001063037' },
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
  it('他人作业', async function () {
    const testData = [
      { _id: '611dbf6f82f7eb001f8a93a1', name: '作业1', stuId: '2001063037' },
      { _id: '611dbf6f82f7eb001f8a93a2', name: '作业2', stuId: '2001063037' },
      { _id: '611dbf6f82f7eb001f8a93a3', name: '作业3', stuId: '2001063037' },
    ];
    await HomeWorkModel.insertMany(testData);
    const id = '611dbf6f82f7eb001f8a93a1';
    const res = await request(app)
      .get('/api/work/otherwork')
      .query({ id })
      .expect(200);
    const data = res.body;
    expect(data).to.be.an('object');
  });
  it('存储作业', async function () {
    const ishaveobj = {
      classId: 123123,
      branch: 'branch123'
    }
    await HomeWorkModel.create(ishaveobj);
    const res = await request(app)
      .post('/api/work/submit')
      .send(ishaveobj) // 在请求中发送测试数据
      .expect(402);
    // 断言响应
    const data = res.body;
    expect(data.message).to.equal('不要重复上传');
  });
  it('删除作业', async function () {
    const textData = [
      { _id: '611dbf6f82f7eb001f8a93b1', name: '作业1', stuId: '2001063037' },
      { _id: '611dbf6f82f7eb001f8a93b2', name: '作业2', stuId: '2001063037' },
    ]
    await HomeWorkModel.insertMany(textData)
    const res = await request(app)
      .post('/api/work/delete')
      .query({ id: '611dbf6f82f7eb001f8a93b1' })
      .expect(200)
      const data = res.body
      expect(data.message).to.equal('删除成功！')
  })
  it('更新作业', async function () {
    const testData = {
      classId: 123123,
      stuId: 2001063037,
      subject: 'Math',
      branch: 'branch123',
      file: {},
      content: '作业内容...',
      score: 90,
      tComments: '老师评语...',
      favor: false,
      isPass: true
    };
    const x = await HomeWorkModel.create(testData)
    const res = await request(app)
      .post(`/api/work/upload`)
      .send({
        id:x._id,
        classId: 123123,
        stuId: 2001063037,
        subject: 'Math',
        branch: '我修改了',
        file: {},
        content: '作业内容...',
        score: 90,
        tComments: '老师评语...',
        favor: false,
        isPass: true
      })
      .expect(200)
      const data = res.body
      expect(data).to.be.an('object')
      expect(data.classId).to.equal(123123)
      expect(data.branch).to.equal('我修改了')
  })
});
