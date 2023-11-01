
const mockTime = () => {
  // 获取当前时间
  let now = new Date();

  // 获取一个月前的时间
  let oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // 随机生成一个月内的任意时间
  let time = Math.floor(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()));

  // 创建一个新的日期对象，表示time的后面1到3天的时间
  let cutTime = new Date(time);
  cutTime.setDate(cutTime.getDate() + Math.floor(Math.random() * 3) + 1);
  cutTime.setHours(0, 0, 0, 0);  // 设置时间为当天的0:00
  return { time, cutTime: cutTime.getTime() }
}
module.exports = mockTime
