var account;
var temp;
var temp1;
var testrpc;

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
	  accounts = web3.eth.getAccounts();
	  accounts.then(function(value) {
	  	account = value[0]
	  })
	} else {
	  // set the provider you want from Web3.providers
		var text = document.getElementById("warning");
		text.innerHTML = "No ethereum Api detected, please install MetaMask first!!!";
	}
 	// var abi = JSON.parse(rawAbi);
	testrpc = new Web3(new Web3.providers.HttpProvider('http://116.62.151.218:8545'));
})

document.getElementById("sendeth").onclick = function search() {
	var text = document.getElementById("sendResult");
	text.innerHTML = "等待转账确认..."
	testrpc.eth.getAccounts().then( e=> {
		accts = e;
		testrpc.eth.sendTransaction({from: accts[0], to: account, value: web3.utils.toWei('0.5')})
		.on('receipt', function(receipt) {
			text.innerHTML = "Ckeck you matemask."
		})
		.on('error', function(error) {
			text.innerHTML = "Oops!!, Unknow error..."
		});
	});
}
