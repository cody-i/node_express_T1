const pool = require('./DBConfig.js');

module.exports = {
    checkLoginUser : async function (name, psw){
		var sql = 'select * from tbl_userInfo where name = ? and password = ?';
		var params = [];
		params.push(name);
		params.push(psw);
		var res = await query(sql, params);
		return res;
	},
	insertUserTable : function (name, psw, date){
		var sqlStr = 'insert into tbl_userInfo(name, password, registerDate, isManager, isDelete) values(?,?,?,0,0)';
		var params = [];
		params.push(name);
		params.push(psw);
		params.push(date);
		pool.getConnection(function(err, connection){
			// Use the connection
			connection.query(sqlStr, params, function(error, result){
				connection.release();
				// Handle error after the release.
				if (error) throw error;
				// Don't use the connection here, it has been returned to the pool.
			});
		});
	},
};

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
