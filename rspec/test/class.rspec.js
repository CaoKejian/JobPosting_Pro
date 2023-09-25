const { request, app, UserModel, ClassInfoModel, expect } = require('../setup')

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
      .set('Authorization', `Bearer testToken`)
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
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data.message).to.equal('该班级下没有同学')
  })
  it('查询姓名', async function () {
    const textData = [
      { name: '1', stuId: 2001, email: 'haha@qq.com' },
      { name: '2', stuId: 2002, email: 'hehe@qq.com' },
    ]
    await ClassInfoModel.insertMany(textData)
    await UserModel.insertMany(textData)
    const res = await request(app)
      .get('/api/class/stuid/name')
      .query({ stuId: 2001 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.name).to.be.equal('1')
    expect(data.email).to.be.equal('haha@qq.com')
  })
  it('新增人员', async function () {
    const textData = [
      { name: '1111', stuId: 2001, classId: 111, isAuth: false },
      { name: '2222', stuId: 2002, classId: 111, isAuth: false },
    ]
    await ClassInfoModel.deleteMany({})
    await ClassInfoModel.insertMany(textData)
    const res = await request(app)
      .post('/api/class/insert')
      .send({ name: '3333', stuId: 2003, classId: 111, isAuth: false })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.be.equal('成员信息添加成功！')
    expect(data.data.name).to.be.equal('3333')
  })
  it('新增人员(重复处理)', async function () {
    const textData = [
      { name: '1111', stuId: 2001, classId: 111, isAuth: false },
      { name: '2222', stuId: 2002, classId: 111, isAuth: false },
    ]
    await ClassInfoModel.deleteMany({})
    await ClassInfoModel.insertMany(textData)
    const res = await request(app)
      .post('/api/class/insert')
      .send({ name: '3333', stuId: 2001, classId: 111, isAuth: false })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.be.equal('成员信息已存在！')
  })
})