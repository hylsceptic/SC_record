function init() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
	  web3.eth.net.getId().then(netId => {
		  switch (netId) {
		    case 1:
		      console.log('This is mainnet')
		      break
		    case 2:
		      console.log('This is the deprecated Morden test network.')
		      break
		    case 3:
	      		address = '0x94c19b9343Ab70047c96E783D87E682955A2fef9';
				myContract = new web3.eth.Contract(abi, address);
		      break
		    default:
		      console.log('This is an unknown network.')
		  }
		});
	  accounts = web3.eth.getAccounts();
	  accounts.then(function(value) {
	  	account = value[0];
	  });
	} else {
	  // set the provider you want from Web3.providers
		var text = document.getElementById("warning");
		text.innerHTML = "No ethereum Api detected, please install MetaMask first!!!";
	}
	myContract = new web3.eth.Contract(abi, address);
 	// var abi = JSON.parse(rawAbi);
}