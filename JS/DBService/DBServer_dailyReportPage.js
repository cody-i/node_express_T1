/**
 * Created by li on 2019/5/28.
 */
const pool = require('./DBConfig.js');

module.exports = {
    getWorkInfo: async (userName, workId)=>{
        var sql = 'select * from tbl_workList where workId = ? and owner = ?';
        var params = [];

        params.push(workId);
        params.push(userName);
        var res = await query(sql, params);
        return res;
    }
}

function query (sql, params){
    // 返回一个Promise
    return new Promise(function(resolve, reject){
        // 写正常的mysql请求操作代码
        pool.getConnection(function(err, conn){
            if(err){
                reject(err);
            }else{
                conn.query(sql, params, function(err2, res){
                    if(err2){
                        reject(err2);
                    }else{
                        resolve(res);
                    }
                    // 释放链接
                    conn.release();
                    console.log('release pool');
                })
            }
        })
    });
}
