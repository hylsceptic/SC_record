var express = require('express');
var fs = require('fs');
var url = require('url');
var ipfsAPI = require('ipfs-api');
var multiparty = require('multiparty');
var abi = require('./js/abi.js');
var Web3 = require('web3');
var myDb = require('./db.js');

var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://116.62.151.218:8545'));

var pk = web3.utils.sha3("this is a private account");
web3.eth.accounts.wallet.add(pk);
var account = web3.eth.accounts.privateKeyToAccount(pk);
addr = account.address;

var myContract = new web3.eth.Contract(abi.abi, abi.address);

var form;

var app = express();

app.get('/', (req, res) => {
  fs.readFile('./index.html', (err, file) => {
    if(!err) {res.write(file);res.end()}
  });
});

app.get(/.*html$/, (req, res) => {
  if(fs.existsSync('.' + req.url, function(){})) {
        returnFile('.' + req.url, res);
      }
});

app.get('/js/:id', (req, res) => {
  if(fs.existsSync('./js/'+req.params.id, function(){})) {
        returnFile('./js/'+req.params.id, res);
      }
});

app.get('/css/:id', (req, res) => {
  if(fs.existsSync('./css/'+req.params.id, function(){})) {
        returnFile('./css/'+req.params.id, res);
      }
});

app.get('/test', (req, res) => {
  res.send('test');
})

app.post('/register', (req, res) => {
  form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
      var userHash = fields.userHash[0];
      var userName = fields.userName[0];
      var address = fields.address[0];
      register(userHash, address, function(result){
        if(result == 'err') {
          res.write("error");
          res.end();
        } else {
          // console.log(result);
          res.write(result.transactionHash);
          res.end();
          myDb.insertUser(userName, userHash, address, (err) => {
            if(err) console.log("DB error: ", err);
          });
        }
      });
    }
  });
});

app.post('/write', (req, res) => {
  form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
      var userHash = fields.userHash[0];
      var userName = fields.userName[0];
      var dataName = fields.dataName[0];
      var dataNameHash = fields.dataNameHash[0];
      var data = JSON.parse(fields.data[0]);
      var signature = JSON.parse(fields.signature[0]);
      // console.log(data, signature)
      writePublicRecord(userHash, dataNameHash, data, signature, function(result){
        if(result == 'err') {
          res.write("error");
          res.end();
        } else {
          res.write(result.transactionHash);
          res.end();
          myDb.insertDate(userName, dataName, data, (err) => {
            if(err) console.log("DB error: ", err);
          });
        }
      });
    }
  });
});


app.post('/api/getUser', (req, res) => {
  form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
      var userName = fields.userName[0];
      myDb.getUser(userName, (err, result) => {
        if(err) {
          console.log("DB error: ", err);
          res.write("error");
          res.end();
        } else {
          res.write(JSON.stringify(result));
          res.end();
        }
      });
    }
  });
});


app.post('/confirm', (req, res) => {
  form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
      var drafter = fields.drafter[0];
      var confirmer = fields.confirmer[0];
      var dataName = fields.dataName[0];
      var signature = JSON.parse(fields.signature[0]);
      confirm(confirmer, drafter, dataName, signature, function(err, result){
        if(result == 'err') {
          res.write("error");
          res.end();
        } else {
          res.write(result.transactionHash);
          res.end();
        }
      });
    }
  });
});

app.post('/witness', (req, res) => {
    form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
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
    }
  );
});

app.post('/cgpwd', (req, res) => {
  form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
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
  });
});

app.get('/newData', (req, res) => {
  myDb.read('datas', (err, result) => {
    if (err) {
      res.write("error");
      res.end();
    } else {
      res.write(JSON.stringify(result));
      res.end();
    }
  });
});

app.post('/ipfs', (req, res) => {
  form = new multiparty.Form();
  form.maxFieldsSize = 110485760;
  form.parse(req, function(err, fields, files) {
    if(err) {console.log("Parse error:", err)} else {
      var data = JSON.parse(fields.data[0]);
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
  }); 
});

app.listen(8081);


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