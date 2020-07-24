// 设置 Mongoose 连接
const mongoose = require('mongoose'); // 引入mongoose
//连接到bigdata数据库
const mongoDB = 'mongodb://localhost:27017/wechatroom';
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
  if (err) {
    console.log('Connection Error:' + err);
  } else {
    console.log('Connection Success!');
  }
});

module.exports = mongoose;
