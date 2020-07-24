const mongoose = require('mongoose'); // 引入mongoose模块

// 定义数据模型，创建集合
const groupRecordsSchema = mongoose.Schema({
  fromId: String,
  nickname: String,
  avatar: String,
  message: String,
  time: String,
}, {collection: 'groupRecords'});

module.exports = mongoose.model('groupRecords', groupRecordsSchema);
