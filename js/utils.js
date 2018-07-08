function init() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  localWeb3 = new Web3(web3.currentProvider);
	  localWeb3.eth.net.getId().then(netId => {
		  switch (netId) {
		    case 1:
		      console.log('This is mainnet');
		      break;
		    case 2:
		      console.log('This is the deprecated Morden test network.');
		      break;
		    case 3:
		    	// repsten net work.
	      		address = '0x94c19b9343Ab70047c96E783D87E682955A2fef9';
				myContract = new localWeb3.eth.Contract(abi, address);
		      break;
		    default:
		      // local network.
		      console.log('This is an unknown or local network.');
			  myContract = new localWeb3.eth.Contract(abi, address);
		  }
		});
	  accounts = localWeb3.eth.getAccounts();
	  accounts.then(function(value) {
	  	account = value[0];
	  });
	} else {
		var text = document.getElementById("warning");
		text.innerHTML = "No ethereum Api detected, please install MetaMask first!!!";
	}
}

function sign(msg, pk) {
	var Signature = localWeb3.eth.accounts.sign(msg, pk);
	var signature = Signature.signature.substr(2); //remove 0x
	var r = '0x' + signature.slice(0, 64);
	var s = '0x' + signature.slice(64, 128);
	var v = '0x' + signature.slice(128, 130);
	return	{v: v, r: r, s: s};
}


function request(method, url, formData, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(data);
		}
	};
	xhttp.open(method, url, true);
	if(formData == null) xhttp.send();
	else xhttp.send(formData);
}