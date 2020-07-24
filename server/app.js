var express = require('express');
var bodyParser = require('body-parser'); // 解析用req.body获取的post参数
var path = require('path');//用来解析文件和目录的核心node库
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
const {avatarLocalAddr, exitPath} = require('./constant/constant');
const fs = require('fs');

const jwtAuth = require('./token/jwt');

require('./db'); // 引入数据库连接配置

//然后require()的是用户路由目录的模块。这些模块用来处理特定
//的“路由”（URL路径）。可以通过添加新文件来扩展骨架应用，
var usersApiRouter = require('./routes/user');
var indexRouter = require('./routes');

//用导入的express模块来创建app对象
var app = express();

// 然后使用它来设置视图（模板）引擎
//首先设置‘views’以制定模板的存储文件夹（此处设为子文件夹/views）
app.set('views', path.join(__dirname, 'views'));
//然后设置‘view engine’以制定模板库（‘html’）
app.engine('html', ejs.__express);
app.set('view engine', 'html');

//下一组app.use()调用将中间件库添加进请求处理链。
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false, parameterLimit: 10000}));
app.use(cookieParser());
//除了之前导入的第三方库之外，我们还是用express.static中间件将
//项目根目录下所有静态文件托管至/public目录
app.use(express.static(path.join(__dirname, 'public')));

// 配置虚拟路径 -- 映射到服务端文件夹
// app.use('/avatar', express.static('/root/weChatRoom/static/avatar'));

app.use('/avatar', express.static(avatarLocalAddr));

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 404判断
app.use((req, res, next) => {
  if (!exitPath.includes(req.path) && !req.path.includes('api')) {
    fs.readFile('./views/error.html', 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      res.set('Content-Type', 'text/html');
      res.send(data);
    });
  } else {
    next();
  }
});
// 所有请求过来都会进行身份验证
app.use(jwtAuth);

//所有中间件都已设置完毕，现在把（之前导入的）路由处理器添加到请求处理链中。
//从而为网站的不同部分定义具体的路由：
app.use('/api', usersApiRouter);
app.use('/', indexRouter);

// 拦截器
// eslint-disable-next-line no-unused-vars
// app.use((req, res, next) => {
//   console.log("拦截")
//   next()
// })

//Express 应用对象（app）现已完成配置。最后一步是将其添加到
// exports 模块（使它可以通过 /bin/www 导入）。
module.exports = app;
