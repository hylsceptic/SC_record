var myDb = require('./db.js');
var mysql = require('mysql');
var  myDate = new Date();

var con = mysql.createConnection({
  host: "116.62.151.218",
  user: "hyl",
  password: "hyl",
  database: 'users'
});

myDb.read('datas');
// read('users');
// myDb.insertUser('hyl', 'hyl');
function read(tableName) {

	con.connect(function(err) {
	  	if(err) {console.log(err);} else {
			  con.query(`SELECT * FROM users`, function (err, result, fields) {
			    if (err) throw err;
			    // console.log(time.toLocaleString());
			    console.log(result);
			  });
			}
		});
	// con.end();
}
