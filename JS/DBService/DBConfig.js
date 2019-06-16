const mySQL = require('mysql');

var DBInfo = {
	host       : "localhost",
	user       : "root",
	password   : "123456",
	database   : "dailyReport"
};

const pool = mySQL.createPool({
	user:DBInfo.user,
	password:DBInfo.password,
	database:DBInfo.database,
	//useConnectionPooling: true,
	stringifyObjects:true,
	dateStrings: true
});

module.exports = pool;
