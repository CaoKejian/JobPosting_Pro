const { request, app, FeedBackModel, expect } = require('../setup')

describe('反馈测试', function () {
  it('查询反馈总量', async function () {
    const testData = [
      { stuId: 1, feedBackValue: '1', email: '1@qq.com', name: '1' },
      { stuId: 2, feedBackValue: '2', email: '2@qq.com', name: '1' },
      { stuId: 3, feedBackValue: '3', email: '3@qq.com', name: '1' },
      { stuId: 4, feedBackValue: '4', email: '4@qq.com', name: '1' },
      { stuId: 5, feedBackValue: '5', email: '5@qq.com', name: '1' },
    ]
    await FeedBackModel.insertMany(testData)
    await FeedBackModel.insertMany(testData)
    await FeedBackModel.insertMany(testData)
    await FeedBackModel.insertMany(testData)
    const res = await request(app)
      .get('/api/feedback')
      .query({ page: 1 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data.data).to.be.an('array')
    expect(data.data).to.have.lengthOf(16)
    expect(data.pagination.total).to.equal(20)
    expect(data.pagination.currentPage).to.equal('1')
    expect(data.pagination.totalPages).to.equal(2)
  })
  it('查询反馈总量(第二页)', async function () {
    const res = await request(app)
      .get('/api/feedback')
      .query({ page: 2 })
      .set('Authorization', `Bearer testToken`)
      .expect(200)
    const data = res.body
    expect(data.data).to.be.an('array')
    expect(data.data).to.have.lengthOf(4)
  })
})