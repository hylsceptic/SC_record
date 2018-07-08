var account;
var myContract;
var localWeb3;


window.addEventListener('load', init());

window.addEventListener('load', () => {
	window.localStorage.clear();
});

document.getElementById("register").onclick = function search() {
	var text = document.getElementById("registerresult");
	var userName = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var password1 = document.getElementById("password2r").value;
	if(password != password1) {
		text.innerHTML = "密码不一致...";
		return 0;
	}
	pk = localWeb3.utils.sha3(password);
	userNameHash = localWeb3.utils.sha3(userName);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);
	console.log(userNameHash);
	text.innerHTML = "等待转账确认...";
	var server = document.getElementById('server');
	if(server.checked) {
		var formData = new FormData();
		formData.append('userName', userName);
		formData.append('userHash', userNameHash);
		formData.append('address', accounts.address);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				if(data=="error") {
					text.innerHTML = "注册失败，用户名是否已注册。";
				} else {
					window.localStorage.setItem('userName', userName);
					window.localStorage.setItem('passwd', password);
					var formData = new FormData();
					window.location.href='index.html';
				}
			}
		};
		xhttp.open('POST', 'register', true);
		xhttp.send(formData);
	} else {
		myContract.methods.register(userNameHash, accounts.address).send({from: account})
		.on('receipt', function(receipt) {
			window.localStorage.setItem('userName', userName);
			window.localStorage.setItem('passwd', password);
			var formData = new FormData();
			formData.append('userName', userName);
			formData.append('userHash', userNameHash);
			formData.append('address', accounts.address);
			request('POST', 'api/addUser', formData, (result) => {console.log(result);});
			window.location.href='index.html';
		})
		.on('error', function(error) {
			text.innerHTML = "注册失败，用户名是否已注册。";
		});
	}
};

document.getElementById("login").onclick = function search() {
	var text = document.getElementById("loginresult");
	var userName = document.getElementById("username1").value;
	var password = document.getElementById("password1").value;
	pk = localWeb3.utils.sha3(password);
	userNameHash = localWeb3.utils.sha3(userName);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);

	var formData = new FormData();
	formData.append('userName', userName);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = this.responseText;
			// console.log(data);
			if(data=="error") {
				text.innerHTML = "连接服务器失败...";
			} else {
				data = JSON.parse(data);
				if(data.length > 0 && accounts.address == data[0].address) {
					window.localStorage.setItem('userName', userName);
					window.localStorage.setItem('passwd', password);
					window.location.href='index.html';
				} else 	text.innerHTML = "用户名或者密码错误...";
			}
		}
	};
	xhttp.open('POST', 'api/getUser', true);
	xhttp.send(formData);
};
