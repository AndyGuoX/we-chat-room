const fs = require('fs');

/* 时间戳 */
function getCurrentTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;
  let day = date.getDate();
  if (day < 10) day = '0' + day;
  let hour = date.getHours();
  if (hour < 10) hour = '0' + hour;
  let minute = date.getMinutes();
  if (minute < 10) minute = '0' + minute;

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

/**
 * generateUUID 生成UUID
 * @returns {string} 返回字符串
 */
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  return new Promise((resolve, reject) => {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
      if (err) {
        return reject(err);
      } else {
        return resolve(files);
      }
    });
  });
}

module.exports = {
  getCurrentTime,
  generateUUID,
  fileDisplay
};
