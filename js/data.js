var account;
var temp;
var temp1;
var localWeb3;


window.addEventListener('load', init());

document.getElementById("write").onclick = function search() {
 
	var username = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var name = document.getElementById("name2").value;
	var data = document.getElementById("data").value;
	var userNameHash = localWeb3.utils.sha3(username);
	var pk = localWeb3.utils.sha3(password);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);

	dataNameHash = localWeb3.utils.sha3(name);
	var signature = sign(dataNameHash.toString('hex'), pk);
	var text = document.getElementById("writeresult");
	var server = document.getElementById('server');
	if(server.checked){
		var formData = new FormData();
		formData.append('userName', username);
		formData.append('userHash', userNameHash);
		formData.append('dataNameHash', dataNameHash);
		formData.append('dataName', name);
		formData.append('data', JSON.stringify(data));
		formData.append('signature', JSON.stringify(signature));
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				if(data=="error") {
					text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复...";
				} else {
					text.innerHTML = "数据写入成功。";
				}
			}
		};
		xhttp.open('POST', 'write', true);
		xhttp.send(formData);
	} else {
		writeData(username, password, name, data);
	}
};



document.getElementById("comfirm").onclick = function search() {
	var comfirmer = document.getElementById("comfirmer").value;
	var confirmerNameHash = localWeb3.utils.sha3(comfirmer);
	var passwd = document.getElementById("comfirmer-passwd").value;
	var text = document.getElementById("comfirmresult");
	var drafter = document.getElementById("drafter").value;
	var drafterNameHash = localWeb3.utils.sha3(drafter);
	var dataName = document.getElementById("comfirm-dataName").value;
	var dataNameHash = localWeb3.utils.sha3(dataName);


	var pk = localWeb3.utils.sha3(passwd);
	signature = sign(localWeb3.utils.sha3(drafterNameHash + dataNameHash.substr(2)), pk);
	console.log(drafterNameHash, dataNameHash, drafterNameHash + dataNameHash.substr(2));
	
	var server = document.getElementById('server');
	if(server.checked){
		var formData = new FormData();
		formData.append('drafter', drafterNameHash);
		formData.append('confirmer', confirmerNameHash);
		formData.append('dataName', dataNameHash);
		formData.append('signature', JSON.stringify(signature));
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				if(data=="error") {
					text.innerHTML = "数据确认失败...";
				} else {
		    		text.innerHTML = "数据确认成功。";
				}
			}
		};
		xhttp.open('POST', 'confirm', true);
		xhttp.send(formData);
	} else {
		myContract.methods.confirm(confirmerNameHash, drafterNameHash, dataNameHash, signature.v, signature.r, signature.s)
		.send({from: account})
		.on('receipt', function(receipt){
		    text.innerHTML = "数据确认成功。";
		    })
		.on('error', function(error) {text.innerHTML = "数据确认失败...";});
	}
};

document.getElementById("witness").onclick = function search() {
	var eyewitness = document.getElementById("eyewitness").value;
	var eyewitnessNameHash = localWeb3.utils.sha3(eyewitness);
	var passwd = document.getElementById("eyewitness-passwd").value;
	var drafter = document.getElementById("drafterofwitness").value;
	var drafterNameHash = localWeb3.utils.sha3(drafter);
	var dataName = document.getElementById("eyewitness-dataName").value;
	var dataNameHash = localWeb3.utils.sha3(dataName);
	var confirmer = document.getElementById("confirmerofwitness").value;
	var confirmerNameHash = localWeb3.utils.sha3(confirmer);
	var text = document.getElementById("witnessresult");


	var pk = localWeb3.utils.sha3(passwd);
	var msg = localWeb3.utils.sha3(localWeb3.utils.sha3(confirmerNameHash + drafterNameHash.substr(2)) + dataNameHash.substr(2));
	signature = sign(msg, pk);
	// console.log(drafterNameHash, dataNameHash, drafterNameHash + dataNameHash.substr(2))
	
	var server = document.getElementById('server');
	if(server.checked){
		var formData = new FormData();
		formData.append('drafter', drafterNameHash);
		formData.append('confirmer', confirmerNameHash);
		formData.append('eyewitness', eyewitnessNameHash);
		formData.append('dataName', dataNameHash);
		formData.append('signature', JSON.stringify(signature));
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				if(data=="error") {
					text.innerHTML = "数据确认失败...";
				} else {
		    		text.innerHTML = "数据确认成功。";
				}
			}
		};
		xhttp.open('POST', 'witness', true);
		xhttp.send(formData);
	} else {
		myContract.methods.witness(eyewitnessNameHash, confirmerNameHash, drafterNameHash, 
			dataNameHash, signature.v, signature.r, signature.s)
		.send({from: account})
		.on('receipt', function(receipt){
		    text.innerHTML = "数据确认成功。";
		    })
		.on('error', function(error) {text.innerHTML = "数据确认失败...";});
	}
};

function writeData(userName, passwd, dataName, data) {
	var userNameHash = localWeb3.utils.sha3(userName);
	var pk = localWeb3.utils.sha3(passwd);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);

	dataNameHash = localWeb3.utils.sha3(dataName);
	var signature = sign(dataNameHash.toString('hex'), pk);

	var text = document.getElementById("writeresult");
	text.innerHTML = "等待转账确认...";
	myContract.methods.writePublicRecord(
		userNameHash, localWeb3.utils.sha3(dataName), data, signature.v, signature.r, signature.s)
	.send({from: account, gas: 1000000})
	.on('receipt', function(receipt){
		var formData = new FormData();
		formData.append('userName', userName);
		formData.append('dataName', dataName);
		formData.append('data', JSON.stringify(data));
		request('POST', 'api/addData', formData, (result) => {});
	    text.innerHTML = "数据写入成功。";
	    })
	.on('error', function(error) {text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复...";});

}

