let fs = require("fs");
const solc = require('solc');
let Web3 = require('web3'); // https://www.npmjs.com/package/web3

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Read the compiled contract code
// Compile with

const input = fs.readFileSync('./contracts/records.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':record'].bytecode;
const abi = JSON.parse(output.contracts[':record'].interface);
// Contract object
const contract = new web3.eth.Contract(abi);

// Deploy contract instance
var address;
const contractInstance = contract.deploy({
  data: '0x' + bytecode,
}).send({
  from: '0x9093Ee696F562DE758a0423E6Abfe2e5E26D1E50',
  gas: 1000000,
  gasPrice: 2e9
})
.on('error', function(error){ console.log("Error: " + error) })
.on('transactionHash', function(transactionHash){ console.log('transactionHash :' + transactionHash) })
.on('receipt', function(receipt){
  const address = receipt.contractAddress;
  var json = ("address = " + JSON.stringify(address) + ';\nabi = ' + JSON.stringify(abi))
  fs.writeFile('./js/abi.json', json, 'utf8');
  json = json + `
module.exports.abi = abi;  
module.exports.address = address; 
`
  fs.writeFile('./js/abi.js', json, 'utf8');
   console.log(receipt.contractAddress) // contains the new contract address
});
// Quick test the contract

