var chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require('../../app.js');
const UserModel = require('../../model/user.js');
const ClassInfoModel = require('../../model/classInfo.js');
chai.use(chaiHttp);
const expect = chai.expect;

require('../mongodb.setup.js')

describe('user', function (req, res) {
  it('查询班级下所有成员', async function () {
    const textData = [
      { classId: 123123, name: '1' },
      { classId: 123123, name: '2' },
      { classId: 111111, name: '3' },
    ]
    await UserModel.insertMany(textData)
    const res = await request(app)
      .get('/api/user/demand')
      .query({ classId: 123123 })
      .expect(200);
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(2)
    expect(data[0].name).to.equal('1')
  })
  it('设置总裁权限', async function () {
    const textData = [
      { classId: 1, name: '1', isAuth: false, stuId: 111 },
      { classId: 1, name: '2', isAuth: false, stuId: 222 },
      { classId: 1, name: '3', isAuth: false, stuId: 333 },
    ]
    await UserModel.deleteMany({})
    await UserModel.insertMany(textData)
    const res = await request(app)
      .post('/api/user/president/set')
      .send({ stuId: 111 })
      .expect(200);
    const data = res.body
    expect(data.data).to.equal(true)
  })
  it('设置管理员权限', async function () {
    const textData = [
      { classId: 123, name: '123', isAuth: false, stuId: 123123, isRoot: false },
    ]
    await UserModel.deleteMany({})
    await UserModel.insertMany(textData)
    await ClassInfoModel.insertMany(textData)
    const res = await request(app)
      .post('/api/user/president/set')
      .send({ stuId: 123123, isRoot: true })
      .expect(200);
    const data = res.body
    expect(data.data).to.equal(true)
  })
  it('创建用户', async function () {
    const res = await request(app)
      .post('/api/user')
      .send({ email: '1849201815@qq.com', name: '123', stuId: 121212 })
      .expect(201);
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('用户创建成功')
  })
  it('创建用户(已存在)', async function () {
    const res = await request(app)
      .post('/api/user')
      .send({ email: '1849201815@qq.com', name: '123', stuId: 121212 })
      .expect(202);
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('用户已存在')
  })
  it('添加至所选班级', async function () {
    const testData = [
      { name: '111', stuId: 2222, classId: 123123 }
    ]
    await UserModel.create(testData)
    const res = await request(app)
      .get('/api/user/addclassId')
      .query({ stuId: 2222, classId: 123123 })
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.success).to.equal(true)
  })
  it('查询未交的名单', async function () {
    const testData = [
      { name: '1', stuId: 1, classId: 123123 },
      { name: '2', stuId: 2, classId: 123123 },
      { name: '3', stuId: 3, classId: 123123 },
    ]
    const stuIds = [1, 2]
    await UserModel.deleteMany({})
    await UserModel.insertMany(testData)
    const res = await request(app)
      .get('/api/user/total')
      .query({ classId: 123123, stuIds })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data[0].name).to.equal('3')
  })
  it('查询未交的名单(空)', async function () {
    const testData = [
      { name: '1', stuId: 1, classId: 123123 },
      { name: '2', stuId: 2, classId: 123123 },
      { name: '3', stuId: 3, classId: 123123 },
    ]
    const stuIds = [1, 2]
    await UserModel.deleteMany({})
    await UserModel.insertMany(testData)
    const res = await request(app)
      .get('/api/user/total')
      .query({ classId: 1, stuIds })
      .set('Authorization', `Bearer testToken`)
      .expect(402)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('未找到任何信息')
  })
})