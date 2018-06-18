var Password;
let fs = require("fs");
const solc = require('solc');
let Web3 = require('web3'); // https://www.npmjs.com/package/web3
const abi = require('./js/abi.js');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

let user = 'hyl'
userHash = web3.utils.sha3(user)
let passwd1 = 'passwd1'
let pk1 = web3.utils.sha3(passwd1);
let account1 = web3.eth.accounts.privateKeyToAccount(pk1);
let passwd2 = 'passwd2'
let pk2 = web3.utils.sha3(passwd2);
let account2 = web3.eth.accounts.privateKeyToAccount(pk2);
let dataName = 'test';
let data = 'test';


let myContract = new web3.eth.Contract(abi.abi, abi.address);
let addr = '0x80905cf1E5a169e745586F5F54648AcC3055ee12'

let addressHash = web3.utils.sha3(account2.address)
let signature1 = sign(addressHash, pk1)

let dataNameHash = web3.utils.sha3(dataName);
signature2 = sign(dataNameHash, pk2);

// register(userHash, account1)
// changePasswd(userHash, account2, signature1)
// writePublicRecord(userHash, dataNameHash, data, signature2)
// readPublicRecord(userHash, dataNameHash)
// myContract.methods.passwords(web3.utils.sha3('1')).call().then(console.log)
// myContract.methods.confirmation(web3.utils.sha3('test2'), web3.utils.sha3('test1'), web3.utils.sha3('1223')).call().then(console.log)
myContract.methods.witnesses(web3.utils.sha3('test3'), web3.utils.sha3('test4'), web3.utils.sha3('test1'), web3.utils.sha3('123')).call().then(console.log)
// myContract.methods.a1().call().then(console.log)
// myContract.methods.a2().call().then(console.log)

function sign(msg, pk) {
	let Signature = web3.eth.accounts.sign(msg, pk)
	let signature = Signature.signature.substr(2); //remove 0x
	const r = '0x' + signature.slice(0, 64);
	const s = '0x' + signature.slice(64, 128);
	const v = '0x' + signature.slice(128, 130);
	return	{v: v, r: r, s: s};
}


function register(userHash, account) {
	myContract.methods.register(userHash, account.address).send({from: addr})
	.on('receipt', function(receipt) {
		console.log("register test: pass......")
	})
	.on('error', function(error) {
		console.log("register test: error......")
	});
}


function changePasswd(userHash, account, signature) {
	myContract.methods.changePasswd(userHash, account.address, signature.v, signature.r, signature.s).send({from: addr})
	.on('receipt', function(receipt) {
		console.log("change password test: pass......")
	})
	.on('error', function(error) {
		console.log("change password test: error......")
		console.log(error)
	});
}



function writePublicRecord(userHash, dataNameHash, data, signature) {
	myContract.methods.writePublicRecord(
		userHash, dataNameHash, data, signature.v, signature.r, signature.s).send({from: addr, gas: 1000000})
	.on('receipt', function(receipt){
		console.log("write data test: pass......")
	    })
	.on('error', function(error) {
		console.log("write data test: error......")
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



