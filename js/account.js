var account;
var myContract;
var localWeb3;


window.addEventListener('load', init());


document.getElementById("cgpwd").onclick = function search() {
	var text = document.getElementById("cgpwdresult");
	var username = document.getElementById("cun1").value;
	var oldPassword = document.getElementById("cpw1").value;
	var newPassword1 = document.getElementById("cpw2").value;
	var newPassword2 = document.getElementById("cpw3").value;
	if(newPassword1 != newPassword2) {
		text.innerHTML = "新密码不一致...";
		return 0;
	}
	userNameHash = localWeb3.utils.sha3(username);
	pk = localWeb3.utils.sha3(newPassword1);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);
	address = accounts.address;

	var addressHash = localWeb3.utils.sha3(address);
	var signMsg = addressHash.toString('hex');
	var signPk = localWeb3.utils.sha3(oldPassword);
	var signature = sign(signMsg, signPk);

	text.innerHTML = "等待转账确认...";
	var server = document.getElementById('server');
	if(server.checked){
		var formData = new FormData();
		formData.append('user', userNameHash);
		formData.append('address', accounts.address);
		formData.append('signature', JSON.stringify(signature));
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				if(data=="error") {
					text.innerHTML = "修改失败。";
				} else {
					text.innerHTML = "修改成功。";
				}
			}
		};
		xhttp.open('POST', 'cgpwd', true);
		xhttp.send(formData);
	} else {
		myContract.methods.changePasswd(userNameHash, address, signature.v, signature.r, signature.s).send({from: account})
		.on('receipt', function(receipt) {
			text.innerHTML = "修改成功。";
		})
		.on('error', function(error) {
			text.innerHTML = "修改失败。";
		});
	}
};


