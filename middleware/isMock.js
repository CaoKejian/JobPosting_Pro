/* 中间件：判断是否为Mock环境 */
const isMock = (req, res, next) => {
  const nodeData = process.env.NODE_DATA
  if (nodeData !== 'mock') {
    res.json({
      type: 'failed',
      desc: '此环境非Mock环境！',
      data: []
    });
  } else {
    next()
  }
}

module.exports = isMock
