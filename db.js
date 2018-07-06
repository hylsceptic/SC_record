var mysql = require('mysql');
var  myDate = new Date();

var con = mysql.createConnection({
  host: "116.62.151.218",
  user: "hyl",
  password: "hyl",
  database: 'users'
});

// con.connect();

// createDb('users');
// deleteTable('datas');
// deleteTable('users');
// createTable();
// insert();
// read();

// con.end();



function createDb(dbName) {
	  con.query(`CREATE DATABASE ${dbName}`, function (err, result) {
	    if (err) throw err;
	    console.log("Database created");
	  });
}

function createTable() {
  var sql = `CREATE TABLE users (
  	userName VARCHAR(255), 
  	userHash VARCHAR(255), 
  	address TEXT,
  	time timestamp) default charset=utf8
  `;
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Table created");
  // });
  sql = `CREATE TABLE datas (
  	name VARCHAR(255), 
  	dataname TEXT,
  	data TEXT,
  	time timestamp) default charset=utf8`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
}

function insertUser(userName, userHash, address) {
  // con.connect(function(err) {
  // 	if(err) {console.log(err);} else {
		  var time = myDate.toLocaleString();
		  console.log(time);
		  var sql = `INSERT INTO users (userName, userHash, address, time) VALUES ('${userName}', '${userHash}', '${address}', '${time}')`;
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    console.log("1 record inserted");
		  });
		// }
  // });
  // con.end();
}

function insertDate(userName, dataName, data) {
  // con.connect(function(err) {
  // 	if(err) {console.log(err);} else {
	  var time = myDate.toLocaleString();
	  console.log(time);
	  var sql = `INSERT INTO datas (name, dataname, data, time) VALUES ('${userName}', '${dataName}', '${data}', '${time}')`;
	  con.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("1 record inserted");
	  });
	// }
 //  });
  // con.end();
}

function read(tableName, callback) {
	// con.connect(function(err) {
	//   	if(err) {console.log(err);} else {
			  con.query(`SELECT * FROM ${tableName} ORDER BY time DESC`, function (err, result, fields) {
			    if (err) throw err;
			    // console.log(time.toLocaleString());
			    callback(result);
			  });
		// 	}
		// });
	// con.end();
}

function deleteTable(tableName) {
  var sql = `DROP TABLE IF EXISTS ${tableName}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
  });
}


module.exports.insertUser = insertUser;
module.exports.insertDate = insertDate;
module.exports.read = read;