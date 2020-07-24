const mongoose = require('mongoose'); // 引入mongoose模块

// const visualPageChildSchema = mongoose.Schema({
//   visualPageId: String,
//   visualPageName: String,
//   visualPageImg: String
// })

// 定义数据模型，创建集合
const userInfoSchema = mongoose.Schema({
  userId: String,
  username: String,
  password: String,
  nickname: String,
  avatar: String,
  isOnline: Boolean,
}, {collection: 'userInfo'});

module.exports = mongoose.model('userInfo', userInfoSchema);
