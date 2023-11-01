const cacheData = require('../Mock/mock.data')
const { fakerZH_CN: faker } = require('@faker-js/faker');
const fs = require('fs');

function MockUser() {
  const mockData = {
    publicName: [],
    publicStuid: [],
    publicClasId: [],
    publicIsAuth: [],
    publicIsRoot: [],
    publicEmail: [],
    publicSubject: [],
    publicUser: []
  }
  for (let i = 0; i < cacheData.dataLts; i++) {
    const mathNum = Math.random()
    mockData.publicName.push(faker.person.fullName())
    mockData.publicStuid.push(Number(2001063037 + i))
    mockData.publicClasId.push(mathNum > 0.5 ? '123123' : '122122')
    mockData.publicIsAuth.push(mathNum > 0.9 ? true : false)
    mockData.publicIsRoot.push(mathNum > 0.95 ? true : false)
    mockData.publicEmail.push(faker.internet.email())
  }
  mockData.publicSubject = MockSubject()
  for (let i = 0; i < 4; i++) {
    mockData.publicUser.push(faker.person.firstName())
  }
  writeFs(mockData)
}
function writeFs(data) {
  const dataString = 'module.exports = ' + JSON.stringify(data, null, 2);
  fs.writeFile('/Users/duibagroup/Desktop/myself/JobPosting_Pro/Mock/mock.data.js', dataString, (err) => {
    if (err) throw err;
  });
}
function MockSubject() {
  return [
    "计算机科学", "数据结构", "算法设计与分析", "计算机网络", "操作系统", "数据库系统", "云计算与大数据", "人工智能", "机器学习", "深度学习", "软件工程", "编程语言理论", "网络安全", "移动应用开发", "Web开发", "分布式系统", "计算机图形学", "虚拟现实", "游戏开发", "物联网"
  ];
}
module.exports = {
  MockUser
}