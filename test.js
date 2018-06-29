var http = require('http');
var fs = require('fs');
//create a server object:
http.createServer(function (req, res) {
  // res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('./index.html', function(err, data) {
	  res.write(data); //write a response to the client
	  res.end(); //ened the response
  });
}).listen(8081); //th server object listens on port 8080