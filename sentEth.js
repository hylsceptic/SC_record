var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


web3.eth.getAccounts().then( e=> {
	accts = e;
	web3.eth.sendTransaction({from: accts[0], to: '0xfda57Bd0897F18d4084DeF9E454A94982E795869', value: web3.utils.toWei('1')})
});   