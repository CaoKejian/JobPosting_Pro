const DateFn = () => {
  const now = new Date();

  // 获取年、月、日、时、分
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth 返回的月份是从0开始的，所以需要+1
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 将月、日、时、分格式化为两位数
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // 构造时间字符串
  const timeString = `${year}/${formattedMonth}/${formattedDay} ${formattedHours}:${formattedMinutes}`;
  return timeString
}
module.exports = DateFn
