// 设置 Mongoose 连接
const mongoose = require('mongoose') // 引入mongoose
// 连接到bigdata数据库
const username = 'root'
const pwd = 'password'
const host = 'localhost'
const post = '27017'
const database = 'wechatroom'
const mongoDB = `mongodb://${ username }:${ pwd }@${ host }:${ post }/${ database }`
// const mongoDB = `mongodb://${ host }:${ post }/${ database }`
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  function (err) {
    if (err) {
      console.log('Connection Error:' + err)
    } else {
      console.log('Connection Success!')
    }
  }
)

module.exports = mongoose
