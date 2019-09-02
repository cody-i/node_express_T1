const express = require('express');
const router = express.Router();
const server_login = require('../Service/server_login.js');
const dailyReportPage = require('../Service/dailyReportPage.js');
const common = require('../Service/common.js');

router.get("/login.html", function(req, res){
	var path = common.getRootPath();
	res.sendFile(`${path}\\public\\html\\login.html`);
});

router.get("/invalidLogin.html", function(req, res){
	var path = common.getRootPath();
	res.sendFile(`${path}\\public\\html\\invalidLogin.html`);
});

router.get("/dailyReportPage.html", function(req, res){
	var path = common.getRootPath();

	if(req.session.isLogin){// 正常登陆的用户，引导至业务页面
		res.sendFile(`${path}\\public\\html\\dailyReportPage.html`);
	}else{//非正常登陆的用户，引导至非法登陆页面
		//res.sendFile(`${path}\\public\\html\\login.html`);
		res.redirect('./invalidLogin.html');
	}
});




router.post('/login', function(req, res){
	server_login.login(req, res);
});

router.post('/logout', function(req, res){
  req.session.destroy(function(){
    console.log('用户登出');
  });
});

router.post('/getUserNameFromSession', function(req, res){
	var userName = req.session.userName;
	res.send(JSON.stringify({userName:userName}));
});

router.post('/getWorkListByWorkIdAndUserName', function(req, res){
	dailyReportPage.getWorkListByWorkIdAndUserName(req, res);
});

/*下载 - 文件流 */
router.get('/download', function(req, res){
	var path = `${common.getRootPath()}\\public\\1.txt`;
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename=aaa.txt');    // 'aaa.txt' can be customized.
    var fileStream = fs.createReadStream(path);
    fileStream.on('data', function (data) {
        res.write(data, 'binary');
    });
    fileStream.on('end', function () {
        res.end();
    });
});
module.exports = router;