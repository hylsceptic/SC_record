var Web3 = require("web3");
var ethUtils = require('ethereumjs-util');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// var accts;
// // web3.eth.getAccounts().then(e => accts = e);

// var abi = ABI()
// var address = "0x9823719fdffdbf90e8a280f25c6a35cb0c691578"
// myContract = new web3.eth.Contract(abi, address);

var data = "本项目提供在以太坊智能合约上记录数据服务。所记录数据将永远不可删除，不可更改。可随时查询。本项目提供在以太坊智能合约上记录数据服务。所记录数据将永远不可删除，不可更改。可随时查询。"

console.log(web3.utils.utf8ToHex(data))
