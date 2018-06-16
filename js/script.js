// var unique = require('uniq');

var sha256 = ethUtils.sha256('456465')

console.log('sha256', sha256)

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

document.getElementById("register").onclick = function search() {
	// console.log(123);
	// console.log(test);
	var text = document.getElementById("registerresult");
	var username = document.getElementById("username1").value;
	var password = document.getElementById("password1").value;
	var password1 = document.getElementById("password1r").value;
	if(password != password1) {
		text.innerHTML = "密码不一致...";
		return 0
	}
	pk = web3.utils.sha3(password);
	userNaneHash = web3.utils.sha3(username);
	accounts = web3.eth.accounts.privateKeyToAccount(pk);
	// console.log(passwdHash);
	text.innerHTML = "等待转账确认..."
	myContract.methods.register(userNaneHash, accounts.address).send({from: account})
	.on('receipt', function(receipt) {
		text.innerHTML = "注册成功。"
	})
	.on('error', function(error) {
		text.innerHTML = "注册失败，用户名是否已注册。"
	});
}

document.getElementById("write").onclick = function search() {
 
	var username = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var name = document.getElementById("name2").value;
	var data = document.getElementById("data").value;
	writeData(username, password, name, data);
}

document.getElementById("read").onclick = function search() {
	var username = document.getElementById("username3").value;
	userNaneHash = web3.utils.sha3(username);
	var name = document.getElementById("name3").value;
	nameHash = web3.utils.sha3(name);
	var text = document.getElementById("resultdata");
	myContract.methods.readPublicRecord(userNaneHash, nameHash).call().then(
		function(data) {
		if(data=="") {
			document.getElementById("readresult").innerHTML = "无此记录，请检查用户名以及数据名。";
			document.getElementById("resultdata").innerHTML = "";
		} else {

			document.getElementById("readresult").innerHTML = "";
			text.innerHTML = (`
				<h5>Data in this record:</h5>
				<textarea id="textdata" rows="4" cols="40">`
				+ web3.utils.hexToUtf8(data) +
				`</textarea>
				`);
		}
	})
}

function writeData(userName, passwd, dataName, data) {
	var userNameHash = web3.utils.sha3(userName);
	pk = web3.utils.sha3(passwd);
	accounts = web3.eth.accounts.privateKeyToAccount(pk);

	datahex = web3.utils.utf8ToHex(data);

	dataNameHash = web3.utils.sha3(dataName);
	console.log(userNameHash, dataNameHash);
	Signature = web3.eth.accounts.sign(dataNameHash.toString('hex'), pk)

	signature = Signature.signature.substr(2); //remove 0x
	const r = '0x' + signature.slice(0, 64);
	const s = '0x' + signature.slice(64, 128);
	const v = '0x' + signature.slice(128, 130);
	const v_decimal = web3.utils.toDecimal(v);
	console.log(123)

	var text = document.getElementById("writeresult");
	text.innerHTML = "等待转账确认...";
	myContract.methods.writePublicRecord(
		userNameHash, web3.utils.sha3(dataName), datahex, v, r, s).send({from: account, gas: 100000})
	.on('receipt', function(receipt){
	    text.innerHTML = "数据写入成功。";
	    })
	.on('error', function(error) {text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复..."});

}