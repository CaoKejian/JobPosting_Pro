var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const ClassInfoModel = require('../../model/classInfo.js');
chai.use(chaiHttp);
const expect = chai.expect;
require('../mongodb.setup.js')


describe('班级信息', function () {
  it('查询相关同学', async function () {
    const textData = [
      { stuId: 123, name: '1', classId: 123123 },
      { stuId: 111, name: '2', classId: 123123 },
      { stuId: 222, name: '3', classId: 111 },
    ]
    await ClassInfoModel.insertMany(textData)
    const classId = 123123
    const res = await request(app)
      .get('/api/class')
      .query({ classId })
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(2)
  })
  it('查询空判断', async function () {
    const textData = [
      { stuId: 123, name: '1', classId: 123123 },
      { stuId: 111, name: '2', classId: 123123 },
    ]
    await ClassInfoModel.insertMany(textData)
    const classId = 111111
    const res = await request(app)
      .get('/api/class')
      .query({ classId })
      .expect(402)
    const data = res.body
    expect(data.message).to.equal('该班级下没有同学')
  })
})