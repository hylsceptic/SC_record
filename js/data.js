var account;
var temp
var temp1;


function sign(msg, pk) {
	let Signature = web3.eth.accounts.sign(msg, pk)
	let signature = Signature.signature.substr(2); //remove 0x
	const r = '0x' + signature.slice(0, 64);
	const s = '0x' + signature.slice(64, 128);
	const v = '0x' + signature.slice(128, 130);
	return	{v: v, r: r, s: s};
}

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

document.getElementById("write").onclick = function search() {
 
	var username = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var name = document.getElementById("name2").value;
	var data = document.getElementById("data").value;
	writeData(username, password, name, data);
}

document.getElementById("read").onclick = function search() {
	var username = document.getElementById("username3").value;
	userNameHash = web3.utils.sha3(username);
	var name = document.getElementById("name3").value;
	nameHash = web3.utils.sha3(name);
	var text = document.getElementById("resultdata");
	myContract.methods.readPublicRecord(userNameHash, nameHash).call().then(
		function(data) {
		if(data=="") {
			document.getElementById("readresult").innerHTML = "无此记录，请检查用户名以及数据名。";
			document.getElementById("resultdata").innerHTML = "";
		} else {

			document.getElementById("readresult").innerHTML = "";
			text.innerHTML = (`
				<h5>Data in this record:</h5>
				<textarea id="textdata" rows="4" cols="40">`
				+ data +
				`</textarea>
				`);
		}
	})
}

document.getElementById("comfirm").onclick = function search() {
	var comfirmer = document.getElementById("comfirmer").value;
	var comfirmerNameHash = web3.utils.sha3(comfirmer);
	var passwd = document.getElementById("comfirmer-passwd").value;
	var text = document.getElementById("comfirmresult");
	var drafter = document.getElementById("drafter").value;
	var drafterNameHash = web3.utils.sha3(drafter);
	var dataName = document.getElementById("comfirm-dataName").value;
	var dataNameHash = web3.utils.sha3(dataName);


	var pk = web3.utils.sha3(passwd);
	signature = sign(web3.utils.sha3(drafterNameHash + dataNameHash.substr(2)), pk)
	console.log(drafterNameHash, dataNameHash, drafterNameHash + dataNameHash.substr(2))
	
	myContract.methods.confirm(comfirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
	.send({from: account})
	.on('receipt', function(receipt){
	    text.innerHTML = "数据确认成功。";
	    })
	.on('error', function(error) {text.innerHTML = "数据确认失败..."});
}

document.getElementById("witness").onclick = function search() {
	var eyewitness = document.getElementById("eyewitness").value;
	var eyewitnessNameHash = web3.utils.sha3(eyewitness);
	var passwd = document.getElementById("eyewitness-passwd").value;
	var drafter = document.getElementById("drafterofwitness").value;
	var drafterNameHash = web3.utils.sha3(drafter);
	var dataName = document.getElementById("eyewitness-dataName").value;
	var dataNameHash = web3.utils.sha3(dataName);
	var confirmer = document.getElementById("confirmerofwitness").value;
	var confirmerNameHash = web3.utils.sha3(confirmer);
	var text = document.getElementById("witnessresult");


	var pk = web3.utils.sha3(passwd);
	var msg = web3.utils.sha3(web3.utils.sha3(confirmerNameHash + drafterNameHash.substr(2)) + dataNameHash.substr(2));
	signature = sign(msg, pk)
	// console.log(drafterNameHash, dataNameHash, drafterNameHash + dataNameHash.substr(2))
	
	myContract.methods.witness(eyewitnessNameHash, confirmerNameHash, drafterNameHash, 
		dataNameHash, signature.v, signature.r, signature.s)
	.send({from: account})
	.on('receipt', function(receipt){
	    text.innerHTML = "数据确认成功。";
	    })
	.on('error', function(error) {text.innerHTML = "数据确认失败..."});
}

function writeData(userName, passwd, dataName, data) {
	var userNameHash = web3.utils.sha3(userName);
	var pk = web3.utils.sha3(passwd);
	accounts = web3.eth.accounts.privateKeyToAccount(pk);

	dataNameHash = web3.utils.sha3(dataName);
	Signature = web3.eth.accounts.sign(dataNameHash.toString('hex'), pk)

	signature = Signature.signature.substr(2); //remove 0x
	const r = '0x' + signature.slice(0, 64);
	const s = '0x' + signature.slice(64, 128);
	const v = '0x' + signature.slice(128, 130);
	const v_decimal = web3.utils.toDecimal(v);

	var text = document.getElementById("writeresult");
	text.innerHTML = "等待转账确认...";
	myContract.methods.writePublicRecord(
		userNameHash, web3.utils.sha3(dataName), data, v, r, s).send({from: account, gas: 1000000})
	.on('receipt', function(receipt){
	    text.innerHTML = "数据写入成功。";
	    })
	.on('error', function(error) {text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复..."});

}

