const mongoose = require('mongoose'); // 引入mongoose模块

// 定义数据模型，创建集合
const userUserRelationSchema = mongoose.Schema({
  userId: String, // 未读该消息者
  fromId: String, // 消息发送者
}, {collection: 'userUserRelation'});

module.exports = mongoose.model('userUserRelation', userUserRelationSchema);
