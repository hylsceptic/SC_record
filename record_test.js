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

var pk = web3.utils.sha3("this is a private account");
web3.eth.accounts.wallet.add(pk);
var account = web3.eth.accounts.privateKeyToAccount(pk);
addr = account.address;

var myContract = new web3.eth.Contract(abi.abi, abi.address);
web3.eth.getBalance(account.address).then(console.log);

var addressHash = web3.utils.sha3(account2.address);
var signature1 = sign(addressHash, pk1);

var dataNameHash = web3.utils.sha3(dataName);
signature2 = sign(dataNameHash, pk2);
// series(
// 	[
// 	function (callback) {
// 		callback(null, register(userHash, account1));
// 	},
	// function (callback) {
	// 	callback(null, changePasswd(userHash, account2, signature1));
	// },
	// function (callback) {
	// 	callback(null, writePublicRecord(userHash, dataNameHash, data, signature2));
	// },
	// function (callback) {
	// 	readPublicRecord(userHash, dataNameHash);
	// }
// 	],
// 	function (err, result){console.log(result);}
// );
// console.log(myContract._address);
var user = 'test17';
userHash = web3.utils.sha3(user);
// register(userHash, account1);
register(userHash, account1, 
	function() {changePasswd(userHash, account2, signature1, 
		function() {writePublicRecord(userHash, dataNameHash, data, signature2,
			function() {readPublicRecord(userHash, dataNameHash);});});});
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


function register(userHash, account, callback) {
	myContract.methods.register(userHash, account.address).estimateGas({from: addr}).then(
		function(gasLimit) {		
			myContract.methods.register(userHash, account.address).send({from: addr, 
				gas: gasLimit})
			.on('receipt', function(receipt) {
				console.log("register test: pass......");
				typeof callback === 'function' && callback();
			})
			.on('error', function(error) {
				console.log("register test: error......");
			});
		});
}


function changePasswd(userHash, account, signature, callback) {
	myContract.methods.changePasswd(userHash, account.address, signature.v, signature.r, signature.s)
	.estimateGas({from: addr}).then(
		function(gasLimit) {
			myContract.methods.changePasswd(userHash, account.address, signature.v, signature.r, signature.s)
			.send({from: addr, gas: gasLimit})
			.on('receipt', function(receipt) {
				console.log("change password test: pass......");
				typeof callback === 'function' && callback();
			})
			.on('error', function(error) {
				console.log("change password test: error......");
				console.log(error);
			});
		}
		);
}

function writePublicRecord(userHash, dataNameHash, data, signature, callback) {
	myContract.methods.writePublicRecord(
		userHash, dataNameHash, data, signature.v, signature.r, signature.s).send({from: addr, gas: 1000000})
	.on('receipt', function(receipt){
			console.log("write data test: pass......");
			typeof callback === 'function' && callback();
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



