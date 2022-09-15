const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//时分秒转换成秒
const formatHour = time => {
  const hour = time.split(":")[0];
  const min = time.split(":")[1];
  const sec = time.split(":")[2];
  return Number(hour * 60 * 60) + Number(min * 60) + Number(sec);
}
//将秒转化为时分秒
const formatSeconds = endTime => {
  let secondTime = parseInt(endTime) //将传入的秒的值转化为Number
  let min = 0 // 初始化分
  let h = 0 // 初始化小时
  let result = ''
  if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
    min = parseInt(secondTime / 60) //获取分钟，除以60取整数，得到整数分钟
    secondTime = parseInt(secondTime % 60) //获取秒数，秒数取佘，得到整数秒数
    if (min > 60) { //如果分钟大于60，将分钟转换成小时
      h = parseInt(min / 60) //获取小时，获取分钟除以60，得到整数小时
      min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
    }
  }
  result = `${h.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secondTime.toString().padStart(2,'0')}`
  return result
}
const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid

}

module.exports = {
  formatTime,
  formatHour,
  formatSeconds,
  wxuuid
}