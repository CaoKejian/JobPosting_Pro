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
    const user = '曹Sir'
    const res = await request(app)
      .post('/api/subject')
      .send({ classId, subject, user })
      .expect(200)
    const data = res.body
    expect(data.subject).to.equal('React')
  })
  it('查询重复发布', async function () {
    const testData = {
      classId: 123123,
      subject: '高数',
      user: '曹Sir'
    }
    await SubjectModel.create(testData)
    const classId = 123123
    const subject = '高数'
    const user = '曹Sir'
    const res = await request(app)
      .post('/api/subject')
      .send({ classId, subject, user })
      .expect(402)
    const data = res.body
    expect(data.message).to.equal('已存在该学科！')
  })
  it('根据作者查询所有班级和所有学科', async function () {
    const testData = [
      { classId: 123123, subject: '高数', user: '曹Sir' },
      { classId: 122122, subject: 'React', user: '曹Sir' },
      { classId: 123123, subject: '英语', user: '曹Sir' },
      { classId: 123123, subject: '英语', user: '曹Sir222' },
    ]
    await SubjectModel.insertMany(testData)
    const user = '曹Sir'
    const res = await request(app)
      .get('/api/subject/myclass')
      .query({ user })
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.classes).to.be.an('array')
    expect(data.classes).to.have.lengthOf(2)
    expect(data.subjects).to.have.lengthOf(3)
  })
})