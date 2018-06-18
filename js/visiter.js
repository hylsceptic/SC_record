var account;
var temp
var temp1;


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
	myContract = new web3.eth.Contract(abi, address);
})



document.getElementById("send").onclick = function search() {
	var data = document.getElementById("data").value;
	console.log(web3.utils.utf8ToHex(data));
	web3.eth.sendTransaction({
		from: account, 
		to: account, 
		value: 0,
		gas: 32000,
		data: web3.utils.utf8ToHex(data)}).then(function(recepts) {
			console.log(recepts);
		})
}
