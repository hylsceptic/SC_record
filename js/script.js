var account;
var addr;
var testrpc;

window.addEventListener('load', function() {
	// var table = document.getElementById('newData');
	// table.innerHTML = `<p>无法显示...</p>` ;
	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		data = JSON.parse(this.responseText);

	// 		// console.log(data);
	// 		if(data=="error") {
	// 			table.innerHTML = `<p>无法显示...</p>` 
	// 			// text.innerHTML = "数据确认失败...";
	// 		} else {
	// 			text = `
 //          <tr>
 //            <th style="width: 15%">用户名</th>
 //            <th style="width: 15%">数据名</th> 
 //            <th style="width: 70%">数据</th>
 //          </tr>
 //          `;
	// 			for(i=0; i<data.length; i++) {
	// 				item = data[i];
	// 				text = text + `
	// 		          <tr>
	// 		            <th style="width: 15%">${item.name}</th>
	// 		            <th style="width: 15%">${item.dataname}</th> 
	// 		            <th style="width: 70%">${item.data}</th>
	// 		          </tr>
	// 		        `;
	// 			}
	// 			table.innerHTML = text;
	// 		}
	// 	}
	// };
	// xhttp.open('GET', 'newData', true);
	// xhttp.send();
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
	  accounts = web3.eth.getAccounts();
	  accounts.then(function(value) {
	  	account = value[0];
	  });
	} else {
		var text = document.getElementById("warning");
		text.innerHTML = "No ethereum Api detected, please install MetaMask first!!!";
	}
	testrpc = new Web3(new Web3.providers.HttpProvider('http://116.62.151.218:8545'));
	var pk = web3.utils.sha3("this is a private account");
	accounts = web3.eth.accounts.privateKeyToAccount(pk);


});

document.getElementById("sendeth").onclick = function search() {
	var text = document.getElementById("sendResult");
	text.innerHTML = "等待转账确认...";
	testrpc.eth.getTransactionCount(accounts.address).then(function(nonce) {
		console.log(nonce);
			accounts.signTransaction({
				from: accounts.address,
				to: account, 
				value: web3.utils.toWei('0.5'), 
				gas: 21000,
				nonce: nonce,
			}
			)
			.then(function(tx) {
					testrpc.eth.sendSignedTransaction(tx.rawTransaction)
	.on('receipt', function(receipt) {
		text.innerHTML = "Ckeck you matemask.";
	})
	.on('error', function(error) {
		text.innerHTML = "Oops!!, Unknow error...";
	});
});});};
