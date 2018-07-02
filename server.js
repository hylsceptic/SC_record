var http = require('http');
var fs = require('fs');
var url = require('url');
var ipfsAPI = require('ipfs-api');
var multiparty = require('multiparty');
var abi = require('./js/abi.js');
var Web3 = require('web3');

var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://116.62.151.218:8545'));

var pk = web3.utils.sha3("this is a private account");
web3.eth.accounts.wallet.add(pk);
var account = web3.eth.accounts.privateKeyToAccount(pk);
addr = account.address;

var myContract = new web3.eth.Contract(abi.abi, abi.address);

var form;
//create a server object:
http.createServer(function (req, res) {
  try {
    if(req.method == "POST") {
      if(req.url=='/register') {
          form = new multiparty.Form();
          form.parse(req, function(err, fields, files) {
            try{
              var user = fields.user[0];
              var address = fields.address[0];
              register(user, address, function(result){
                if(result == 'err') {
                  res.write("error");
                  res.end();
                } else {
                  // console.log(result);
                  res.write(result.transactionHash);
                  res.end();
                }
              });
            }
            catch(err1) {console.log(err1);}
          }
        );
      }
      if(req.url=='/write') {
          form = new multiparty.Form();
          form.parse(req, function(err, fields, files) {
            try{
              var user = fields.user[0];
              var dataName = fields.dataName[0];
              var data = JSON.parse(fields.data[0]);
              var signature = JSON.parse(fields.signature[0]);
              // console.log(data, signature)
              writePublicRecord(user, dataName, data, signature, function(result){
                if(result == 'err') {
                  res.write("error");
                  res.end();
                } else {
                  res.write(result.transactionHash);
                  res.end();
                }
              });
            }
            catch(err1) {console.log(err1);}
          }
        );
      }
      if(req.url=='/confirm') {
          form = new multiparty.Form();
          form.parse(req, function(err, fields, files) {
            try{
              var drafter = fields.drafter[0];
              var confirmer = fields.confirmer[0];
              var dataName = fields.dataName[0];
              var signature = JSON.parse(fields.signature[0]);
              confirm(confirmer, drafter, dataName, signature, function(result){
                if(result == 'err') {
                  res.write("error");
                  res.end();
                } else {
                  res.write(result.transactionHash);
                  res.end();
                }
              });
            }
            catch(err1) {console.log(err1);}
          }
        );
      }
      if(req.url=='/witness') {
          form = new multiparty.Form();
          form.parse(req, function(err, fields, files) {
            try{
              var drafter = fields.drafter[0];
              var confirmer = fields.confirmer[0];
              var dataName = fields.dataName[0];
              var eyewitness = fields.eyewitness[0];
              var signature = JSON.parse(fields.signature[0]);
              witness(eyewitness, confirmer, drafter, dataName, signature, function(result){
                if(result == 'err') {
                  res.write("error");
                  res.end();
                } else {
                  res.write(result.transactionHash);
                  res.end();
                }
              });
            }
            catch(err1) {console.log(err1);}
          }
        );
      }
      if(req.url=='/cgpwd') {
          form = new multiparty.Form();
          form.parse(req, function(err, fields, files) {
            try{
              var user = fields.user[0];
              var address = fields.address[0];
              var signature = JSON.parse(fields.signature[0]);
              // console.log(address, signature.v);
              changePasswd(user, address, signature, function(result){
                if(result == 'err') {
                  res.write("error");
                  res.end();
                } else {
                  res.write(result.transactionHash);
                  res.end();
                }
              });
            }
            catch(err1) {console.log(err1);}
          }
        );
      }
      if(req.url=='/ipfs'){
        form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
          try{
            var data = JSON.parse(fields.data[0]);
            console.log(typeof data);
            ipfs.files.add(Buffer.from(data), function(err, result) {
              if(err != null) {
                console.log(err);
                res.write(err);
                res.end();
              } else {
                hash = result[0].hash;
                console.log(hash);
                res.write(hash);
                res.end();
              }
            });
          }
          catch(err1) {console.log(err1);}
        });
      }
    } else {
      if(req.url == '/') {
        returnFile("./index.html", res);
      } else if(fs.existsSync('.'+req.url, function(){})) {
        returnFile('.'+req.url, res);
      } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
        var q = url.parse(req.url, true).query;
        var txt = q.year + " " + q.month;
        res.end(txt);
      }
    }
  }
  catch(err) {
    console.log(err);
  }
}).listen(8081); //th server object listens on port 8080



function returnFile(file, res) {
	fs.readFile(file, function(err, data) {
		if(err == null){
			res.write(data);
			res.end();
		}
	});
}


function register(userHash, account, callback) {
    console.log(userHash, account);
    myContract.methods.register(userHash, account).estimateGas({from: addr}).then(
      function(gasLimit) {
        myContract.methods.register(userHash, account).send({from: addr, gas: gasLimit})
        .on('receipt', function(receipt){
        if(typeof callback === 'function') {callback(receipt);}
        })
        .on('error', function(error){
        if(typeof callback === 'function') {callback("err");}
        });
    }).catch(function(error){
      callback('err');
    });
}


function changePasswd(userHash, account, signature, callback) {
  myContract.methods.changePasswd(userHash, account, signature.v, signature.r, signature.s)
  .estimateGas({from: addr}).then(
    function(gasLimit) {
      myContract.methods.changePasswd(userHash, account, signature.v, signature.r, signature.s)
      .send({from: addr, gas: gasLimit})
      .on('receipt', function(receipt) {
        if(typeof callback === 'function') {callback(receipt);}
      })
      .on('error', function(error) {
        console.log(error);
        if(typeof callback === 'function') {callback("err");}
      });
    }
  ).catch(function(error){
        console.log(error);
      callback('err');
    });
}

function writePublicRecord(userHash, dataNameHash, data, signature, callback) {
  myContract.methods.writePublicRecord(userHash, dataNameHash, data, signature.v, signature.r, signature.s)
  .estimateGas({from: addr}).then(
    function(gasLimit) {
      myContract.methods.writePublicRecord(
        userHash, dataNameHash, data, signature.v, signature.r, signature.s).send({from: addr, gas: gasLimit})
      .on('receipt', function(receipt){
        if(typeof callback === 'function') {callback(receipt);}
      })
      .on('error', function(error) {
        if(typeof callback === 'function') {callback("err");}
      });
    }
  ).catch(function(error) {
    if(typeof callback === 'function') {callback("err");}
  });
}

function confirm(comfirmerNameHash, drafterNameHash, dataNameHash, signature, callback) {
  myContract.methods.confirm(comfirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
  .estimateGas({from: addr}).then(
    function(gasLimit) {
      myContract.methods.confirm(comfirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
      .send({from: addr, gas: gasLimit})
      .on('receipt', function(receipt){
        if(typeof callback === 'function') {callback(receipt);}
      })
      .on('error', function(error) {
        if(typeof callback === 'function') {callback("err");}
      });
    }
  ).catch(function(error) {
    if(typeof callback === 'function') {callback("err");}
  });
}

function witness(eyewitnessNameHash, confirmerNameHash, drafterNameHash, dataNameHash, signature, callback) {
  myContract.methods.witness(eyewitnessNameHash, confirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
  .estimateGas({from: addr}).then(
    function(gasLimit) {
      myContract.methods.witness(eyewitnessNameHash, confirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
      .send({from: addr, gas: gasLimit})
      .on('receipt', function(receipt){
        if(typeof callback === 'function') {callback(receipt);}
      })
      .on('error', function(error) {
        if(typeof callback === 'function') {callback("err");}
      });
    }
  ).catch(function(error) {
    if(typeof callback === 'function') {callback("err");}
  });
}