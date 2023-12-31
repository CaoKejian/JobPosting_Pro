const { request, app, PublishWorkModel, expect } = require('../setup')


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
      cutTime: cutTime
    }
    const res = await request(app)
      .post('/api/pub')
      .set('Authorization', `Bearer testToken`)
      .send(testData)
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
      cutTime: cutTime
    }
    await PublishWorkModel.create(testData)
    await PublishWorkModel.create(testData)
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .post('/api/pub')
      .set('Authorization', `Bearer testToken`)
      .send(testData)
      .expect(402)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('已发布该作业！')
  })
  it('按发布者查询', async function () {
    const testData = {
      user: 'xxx',
      classId: 123123,
      subject: '高数二',
      branch: '积分',
      content: '预习积分，完成第二章课后题T32.',
      cutTime: 120
    }
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub/user')
      .query({ user: 'xxx', classId: 123123 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(1)
    expect(data[0].user).to.equal('xxx')
  })
  it('按学科查询', async function () {
    const testData = {
      user: 'xxx',
      classId: 123123,
      subject: '测试',
      branch: '积分',
      content: '预习积分，完成第二章课后题T32.',
      cutTime: 120
    }
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub/subject')
      .query({ subject: '测试' })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(1)
    expect(data[0].subject).to.equal('测试')
  })
  it('按班级查询', async function () {
    const testData = {
      user: 'xxx',
      classId: 111222,
      subject: '测试',
      branch: '积分',
      content: '预习积分，完成第二章课后题T32.',
      cutTime: 120
    }
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub/class')
      .query({ classId: 111222 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('array')
    expect(data).to.have.lengthOf(1)
    expect(data[0].classId).to.equal(111222)
  })
  it('按分支查询', async function () {
    const testData = {
      user: '曹Sir',
      classId: 222222,
      subject: 'React',
      branch: '组件定义',
      content: '预习积分，完成第二章课后题T32.',
      cutTime: 120
    }
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub/branch')
      .query({ branch: '组件定义', subject: 'React', classId: 222222 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.classId).to.equal(222222)
  })
  it('按分支查询(空结果)', async function () {
    const testData = {
      user: '曹Sir',
      classId: 222222,
      subject: 'React',
      branch: '组件定义',
      content: '预习积分，完成第二章课后题T32.',
      cutTime: 120
    }
    await PublishWorkModel.create(testData)
    const res = await request(app)
      .get('/api/pub/branch')
      .query({ branch: 'en', subject: 'React', classId: 222222 })
      .set('Authorization', `Bearer testToken`)
      .expect(402)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.message).to.equal('没有相关信息！')
  })
  it('按学科搜集所有分支', async function () {
    const testData = [
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业1',},
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业2',},
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业3',}
    ]
    await PublishWorkModel.deleteMany({})
    await PublishWorkModel.insertMany(testData)
    const res = await request(app)
      .get('/api/pub/subject/branch')
      .query({ subject: 'React' })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.branches).to.be.an('array')
    expect(data.branches).to.have.lengthOf(3)
    expect(data.branches[1]).to.equal('作业2')
  })
   it('查询某分支的作业详情', async function () {
    const testData = [
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业1',content: '1'},
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业2',content: '2'},
      {user: '曹Sir',classId: 222222,subject: 'React',branch: '作业3',content: '3'}
    ]
    await PublishWorkModel.deleteMany({})
    await PublishWorkModel.insertMany(testData)
    const res = await request(app)
      .get('/api/pub/subject/branch/info')
      .query({ classId:222222, branch: '作业2' })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data).to.be.an('object')
    expect(data.content).to.equal('2')
  })
})