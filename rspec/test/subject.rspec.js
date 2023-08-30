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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.classes).to.be.an('array')
    expect(data.classes).to.have.lengthOf(2)
    expect(data.subjects).to.have.lengthOf(3)
  })
  it('按班级查询所有学科', async function () {
    const testData = [
      { classId: 111, subject: '高数', user: '曹Sir' },
      { classId: 111, subject: 'React', user: '曹Sir' },
      { classId: 222, subject: '英语', user: '曹Sir' },
      { classId: 111, subject: 'React', user: '曹Sir222' },
    ]
    await SubjectModel.insertMany(testData)
    const classId = 111
    const res = await request(app)
      .get('/api/subject/myclass/classId')
      .query({ classId })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.subjects).to.be.an('array')
    expect(data.subjects).to.have.lengthOf(2)
  })
  it('返回个人所属班级的有所有学科', async function () {
    const testData = [
      { classId: 111, subject: '高数', user: '曹Sir1' },
      { classId: 111, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: '英语', user: '曹Sir2' },
    ]
    await SubjectModel.insertMany(testData)
    const classId = 111
    const user = '曹Sir1'
    const res = await request(app)
      .get('/api/subject/myAll/subject')
      .query({ classId, user })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.subjects).to.be.an('array')
    expect(data.subjects).to.have.lengthOf(2)
  })
  it('返回此学科所有提交的作业', async function () {
    const testData = [
      { classId: 111, subject: '高数', user: '曹Sir1' },
      { classId: 122, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: '英语', user: '曹Sir2' },
    ]
    await SubjectModel.deleteMany({})
    await SubjectModel.insertMany(testData)
    const classId = 111
    const user = '曹Sir1'
    const subject = 'React'
    const res = await request(app)
      .get('/api/subject/myclass/work')
      .query({ classId, user, subject })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(1)
    expect(data[0].subject).to.equal('React')
  })
  it('返回此学科所有提交的作业(空)', async function () {
    const testData = [
      { classId: 111, subject: '高数', user: '曹Sir1' },
      { classId: 122, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: 'React', user: '曹Sir1' },
      { classId: 111, subject: '英语', user: '曹Sir2' },
    ]
    await SubjectModel.deleteMany({})
    await SubjectModel.insertMany(testData)
    const classId = 111111111
    const user = '曹Sir1'
    const subject = 'React'
    const res = await request(app)
      .get('/api/subject/myclass/work')
      .query({ classId, user, subject })
      .set('Authorization', `Bearer testToken`)
      .expect(402)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('没有相关作业发布！')
  })
})