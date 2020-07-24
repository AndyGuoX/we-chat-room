const mongoose = require('mongoose'); // 引入mongoose模块

// 定义数据模型，创建集合
const privateRecordsSchema = mongoose.Schema({
  fromId: String,
  toId: String,
  nickname: String,
  avatar: String,
  message: String,
  time: String,
}, {collection: 'privateRecords'});

module.exports = mongoose.model('privateRecords', privateRecordsSchema);
