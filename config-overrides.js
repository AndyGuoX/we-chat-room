const {override, fixBabelImports, addBabelPlugin, addWebpackAlias, addLessLoader} = require('customize-cra');
const path = require('path');
const globalLess = require('./src/common/constant.less.json');
const paths = require('react-scripts/config/paths');
paths.appBuild = path.join(path.dirname(paths.appBuild), 'server/public');
// 导入.env 环境变量
require('dotenv');
// console.log(process.env);
module.exports = override(
  /* 配置antd组件库自动引入css文件，按需引入 */
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
  /* 配置babel编译装饰器 */
  addBabelPlugin(['@babel/plugin-proposal-decorators', {legacy: true}]),
  /* 编译 less 文件 */
  addLessLoader({
    javascriptEnabled: true,
    globalVars: globalLess
  }),
);