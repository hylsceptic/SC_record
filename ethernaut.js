var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/OmKD5bDAup22XMdLyD5Y'));


setInterval(function() {

	web3.eth.getBlockNumber(function(err, num){
		// console.log(num)
		web3.eth.getBlock(num, function(err, block){
			if(err == null){
				console.log(block.hash);
			}
		});
	});
}, 500);