var Web3 = require("web3");
var fs = require("fs");
var solc = require('solc');
var web3 = new Web3(new Web3.providers.HttpProvider('http://116.62.151.218:8545'));
// var localWeb3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// var localWeb3 = 
var pk = web3.utils.sha3("this is a private account");
account1 = web3.eth.accounts.privateKeyToAccount(pk);

var pk = web3.utils.sha3("this is a lucked account again again");
account2 = web3.eth.accounts.privateKeyToAccount(pk);

// web3.eth.getTransactionCount(account2.address).then(function(nonce) {
// 		account2.signTransaction({
// 			from: account2.address,
// 			to: account1.address, 
// 			value: web3.utils.toWei('900'), 
// 			gas: 21000,
// 			nonce: nonce,
// 		}
// 		)//.then(console.log)	
// 		.then(function(tx) {
// 				web3.eth.sendSignedTransaction(tx.rawTransaction);
// });});


// web3 = Web3(HTTPProvider("https://mainnet.infura.io/OmKD5bDAup22XMdLyD5Y"))



web3.eth.getBalance(account1.address).then(console.log);

