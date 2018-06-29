var Web3 = require("web3");
var fs = require("fs");
var solc = require('solc');
var web3 = new Web3(new Web3.providers.HttpProvider('http://116.62.151.218:8545'));
var localWeb3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// var localWeb3 = 
var pk = web3.utils.sha3("this is a private account");
accounts = web3.eth.accounts.privateKeyToAccount(pk);


// var web3 = new Web3();
// console.log(web3.eth.accounts.wallet);
var input = fs.readFileSync('./contracts/records.sol');
var output = solc.compile(input.toString(), 1);
console.log(output['errors']);
var bytecode = output.contracts[':record'].bytecode;
var abi = JSON.parse(output.contracts[':record'].interface);
web3.eth.getTransactionCount(accounts.address).then(function(nonce) {
  // console.log(nonce);
    accounts.signTransaction({
        from: accounts.address,
        gas: 2000000,
        gasPrice: 2e9,
        data: '0x' + bytecode,
        nonce: nonce,
      }
    )//.then(console.log) 
    .then(function(tx) {
        web3.eth.sendSignedTransaction(tx.rawTransaction)
  .on('error', function(error){ console.log("Error: " + error); })
  .on('transactionHash', function(transactionHash){ console.log('transactionHash :' + transactionHash); })
  .on('receipt', function(receipt){
    var address = receipt.contractAddress;
    console.log("123456678");
    var json = ("address = " + JSON.stringify(address) + ';\nabi = ' + JSON.stringify(abi));
    fs.writeFile('./js/abi.json', json, 'utf8');
    json = json + `
  module.exports.abi = abi;  
  module.exports.address = address; 
  `
    fs.writeFile('./js/abi.js', json, 'utf8');
     console.log(receipt.contractAddress); // contains the new contract address
  });
});});