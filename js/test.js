var Web3 = require("web3");
var ethUtils = require('ethereumjs-util');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// var accts;
// // web3.eth.getAccounts().then(e => accts = e);

// var abi = ABI()
// var address = "0x9823719fdffdbf90e8a280f25c6a35cb0c691578"
// myContract = new web3.eth.Contract(abi, address);

var data = "helllo world, 你好世界"

console.log(web3.utils.utf8ToHex(data))
