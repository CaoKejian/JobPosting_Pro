// add.test.js
var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const HomeWorkModel = require('../../model/homeWork.js');
chai.use(chaiHttp);
const expect = chai.expect;

require('../mongodb.setup.js')


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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
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
      isPass: true,
      user: 'xxx',
      cutTime: 123123
    };
    const x = await HomeWorkModel.create(testData)
    const res = await request(app)
      .post(`/api/work/upload`)
      .send({
        id: x._id,
        classId: 123123,
        stuId: 2001063037,
        subject: 'Math',
        branch: '我修改了',
        file: {},
        content: '作业内容...',
        score: 90,
        tComments: '老师评语...',
        favor: false,
        isPass: true,
        user: 'xxx',
        cutTime: 123123
      })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.classId).to.equal(123123)
    expect(data.branch).to.equal('我修改了')
  })
  it('单项作业', async function () {
    const testData = [
      { branch: 'React', stuId: '2001063037' },
      { branch: 'Vue', stuId: '2001063037' },
    ];
    await HomeWorkModel.create(testData);
    const stuId = '2001063037';
    const branch = 'React'
    // 发起HTTP请求
    const res = await request(app)
      .get('/api/work/one')
      .query({ stuId, branch })
      .set('Authorization', `Bearer testToken`)
      .expect(200);

    // 断言返回数据
    const data = res.body;
    expect(data).to.be.an('object');
    expect(data.branch).to.equal('React')
  });
  it('查询多项作业', async function () {
    const textData = [
      { classId: 1231123, branch: 'haha', stuId: 123 },
      { classId: 1231123, branch: 'haha', stuId: 124 },
      { classId: 1231123, branch: 'enen', stuId: 125 },
    ]
    await HomeWorkModel.insertMany(textData)
    const res = await request(app)
      .get('/api/work/class/allWork')
      .query({ classId: 1231123, branch: 'haha' })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(2)
    expect(data[0].stuId).to.equal(123)
  })
});
