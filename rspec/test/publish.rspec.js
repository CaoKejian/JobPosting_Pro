var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const PublishWorkModel = require('../../model/publishWork.js');
chai.use(chaiHttp);
const expect = chai.expect;
require('../mongodb.setup.js')

describe('作业发布', function () {
  it('查询发布成功', async function () {
    codeTimestamp = Date.now();
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; 
    const cutTime = codeTimestamp + twoDaysInMillis;
    const testData = {
      user: '嘿老师',
      classId: 123123,
      subject: '高数二',
      branch: '积分',
      content: '预习积分，完成第二章课后题T32.',
      cutTime
    }
    const res = await request(app)
      .get('/api/pub')
      .query(testData)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.user).to.equal('嘿老师')
  })
  it('查询作业', async function () {
    codeTimestamp = Date.now();
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; 
    const cutTime = codeTimestamp + twoDaysInMillis;
    const testData = {
      user: '嘿老师',
      classId: 123123,
      subject: '高数二',
      branch: '积分',
      content: '预习积分，完成第二章课后题T32.',
      cutTime
    }
    await PublishWorkModel.create(testData)
    await PublishWorkModel.create(testData)
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub')
      .query(testData)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.user).to.equal('嘿老师')
  })
  // it('按发布者查询',)
})