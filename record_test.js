var Password;
var fs = require("fs");
var solc = require('solc');
var Web3 = require('web3'); // https://www.npmjs.com/package/web3
var abi = require('./js/abi.js');
var series = require('async/series');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://116.62.151.218:8545'));
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var passwd1 = 'passwd1';
var pk1 = web3.utils.sha3(passwd1);
var account1 = web3.eth.accounts.privateKeyToAccount(pk1);
var passwd2 = 'passwd2';
var pk2 = web3.utils.sha3(passwd2);
var account2 = web3.eth.accounts.privateKeyToAccount(pk2);
var dataName = 'test';
var data = 'test';


var myContract = new web3.eth.Contract(abi.abi, abi.address);
// web3.eth.getAccounts().then(e => {
// 	console.log(e);
// });
var addr = '0x015C83D3d9bdA8E660A8228b1B952efb50f59A14';

var addressHash = web3.utils.sha3(account2.address);
var signature1 = sign(addressHash, pk1);

var dataNameHash = web3.utils.sha3(dataName);
signature2 = sign(dataNameHash, pk2);

var user = 'hyltest10';
userHash = web3.utils.sha3(user);
series(
	[
	function (callback) {
		register(userHash, account1);
		callback(null, null);
	},
	function (callback) {
		changePasswd(userHash, account2, signature1);
		callback(null, null);
	},
	function (callback) {
		writePublicRecord(userHash, dataNameHash, data, signature2);
		callback(null, null);
	},
	function (callback) {
		readPublicRecord(userHash, dataNameHash);
	}
	],
	function (err, result){console.log(result);}
);

// register(userHash, account1);
// changePasswd(userHash, account2, signature1)
// writePublicRecord(userHash, dataNameHash, data, signature2)
// readPublicRecord(userHash, dataNameHash)
// myContract.methods.passwords(web3.utils.sha3('1')).call().then(console.log)
// myContract.methods.confirmations(
// 	web3.utils.sha3('hyl'), web3.utils.sha3('cxf'), web3.utils.sha3('陈笑')).call().then(console.log);
// myContract.methods.witnesses(
// 	web3.utils.sha3('cxf'), web3.utils.sha3('hyl'), web3.utils.sha3('cxf'), web3.utils.sha3('陈笑 ')).call().then(console.log)
// myContract.methods.a1().call().then(console.log)
// myContract.methods.a2().call().then(console.log)

function sign(msg, pk) {
	var Signature = web3.eth.accounts.sign(msg, pk);
	var signature = Signature.signature.substr(2); //remove 0x
	var r = '0x' + signature.slice(0, 64);
	var s = '0x' + signature.slice(64, 128);
	var v = '0x' + signature.slice(128, 130);
	return	{v: v, r: r, s: s};
}


function register(userHash, account) {
	myContract.methods.register(userHash, account.address).send({from: addr})
	.on('receipt', function(receipt) {
		console.log("register test: pass......");
	})
	.on('error', function(error) {
		console.log("register test: error......");
	});
}


function changePasswd(userHash, account, signature) {
	myContract.methods.changePasswd(userHash, account.address, signature.v, signature.r, signature.s).send({from: addr})
	.on('receipt', function(receipt) {
		console.log("change password test: pass......");
	})
	.on('error', function(error) {
		console.log("change password test: error......");
		console.log(error)
	});
}



function writePublicRecord(userHash, dataNameHash, data, signature) {
	myContract.methods.writePublicRecord(
		userHash, dataNameHash, data, signature.v, signature.r, signature.s).send({from: addr, gas: 1000000})
	.on('receipt', function(receipt){
		console.log("write data test: pass......");
	    })
	.on('error', function(error) {
		console.log("write data test: error......");
	});
}

function readPublicRecord(userHash, dataNameHash) {
	myContract.methods.readPublicRecord(userHash, dataNameHash).call().then(
		function(data) {
		if(data=="") {
		console.log("read data test: error......");
		} else {
		console.log("read data test: pass......");
		}
	});
}



