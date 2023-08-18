var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const SubjectModel = require('../../model/subject.js');
chai.use(chaiHttp);
const expect = chai.expect;
require('../mongodb.setup.js')

describe('学科', function () {
  it('查询发布成功', async function () {
    const classId = 123123
    const subject = 'React'
    const res = await request(app)
      .get('/api/subject')
      .query({ classId, subject })
      .expect(200)
    const data = res.body
    expect(data.subject).to.equal('React')
  })
  it('查询重复发布', async function () {
    const testData = {
      classId: 123123,
      subject: '高数'
    }
    await SubjectModel.create(testData)
    const classId = 123123
    const subject = '高数'
    const res = await request(app)
    .get('/api/subject')
    .query({classId, subject})
    .expect(402)
    const data = res.body
    expect(data.message).to.equal('已存在该学科！')
  })
})