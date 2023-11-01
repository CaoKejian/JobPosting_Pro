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
    publicEmail: []
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
  writeFs(mockData)
}
function writeFs(data) {
  const dataString = 'module.exports = ' + JSON.stringify(data, null, 2);
  fs.writeFile('/Users/duibagroup/Desktop/myself/JobPosting_Pro/Mock/mock.data.js', dataString, (err) => {
    if (err) throw err;
  });
}
module.exports = {
  MockUser
}