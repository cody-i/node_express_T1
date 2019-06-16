var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var router1 = require('./JS/Control/router.js');
const common = require('./JS/Service/common.js');

common.processCommon(); // 共通方法实行
common.setRootPath(__dirname);
var app = express();


/* 中间件使用区 */
// session
/*session的解析依赖cookieparser，因此cookieparser中间件应该放到session之前。
路由处理函数依赖session数据，因此app.router中间件应该放到session之后
*/
app.use(session({
  resave: false,
  saveUninitialized: false,//是否自动保存未初始化的会话
  secret: 'very secret',
	/*cookie: {maxAge: 1000*3}*/  /* set session's expires */
}));

// express静态托管
app.use(express.static('resource'));            // 设定访问静态资源路径为：http://localhost:3000/
app.use('/online', express.static('public'));   // 设定访问静态资源路径为：http://localhost:3000/online

// 解析post数据，没有这个,post方式传送来的json数据都没办法解析
app.use(bodyParser.urlencoded({ extended: false }));

/* 管理路由 */
app.use('/online', router1);

/* 端口监听 */
app.listen(3000);
console.log('service started at localhost:3000');

