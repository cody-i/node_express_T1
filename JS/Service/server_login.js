/**
 * Created by li on 2019/4/28.
 */
const DB = require('../DBService/DBServer_login.js');

module.exports = {
    login : function (req, res){
        console.log('login start');
        var returnInfo = {};
        // data 取得
        var userName = req.body.userName;
        var psw = req.body.password;
        //var registerDate = new Date().format("yyyy-MM-dd hh:mm:ss");
        //console.log(registerDate);

        // 做用户检查
        DB.checkLoginUser(userName, psw).then((ret) => {
            var length = ret.length;
            returnInfo.returnCode = length;
            if(length == 1){
                var row = ret[0];   // 数据库传回的数据取得
                // 如果用户存在，则登陆成功，在session中储存必要的用户信息
                req.session.isLogin = true;
                req.session.userName = userName;
                //res.cookie('userName',  row.userName);
            }

            // 将处理完的数据传回
            res.send(JSON.stringify(returnInfo));
            console.log('login end');
        }).catch((err) => {
            /*do something when catch err*/
        });
    }

}

