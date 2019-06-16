/**
 * Created by li on 2019/5/28.
 */
const DB = require('../DBService/DBServer_dailyReportPage.js');

module.exports = {
    getWorkListByWorkIdAndUserName: function(req, res){
        console.log('getWorkListByWorkIdAndUserName - Start');
        var userName = req.body.userName;
        var workId = req.body.workId;
        //console.log(userName, workId);
        DB.getWorkInfo(userName, workId).then(function(ret){
            var row = ret[0];   // 数据库传回的数据取得
            var obj = {
                returnCode:0,
                workList:row
            }
            res.send(JSON.stringify(obj));
            console.log('getWorkListByWorkIdAndUserName - End');
        }).catch(function (err){
            console.log(`getWorkListByWorkIdAndUserName : ${err}`);
        });
    }
}