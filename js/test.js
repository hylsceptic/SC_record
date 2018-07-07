var account;
var temp;
var temp1;
var localWeb3;
window.addEventListener('load', function() {

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
	  // set the provider you want from localWeb3.providers
		var text = document.getElementById("warning");
		text.innerHTML = "No ethereum Api detected, please install MetaMask first!!!";
	}
	if(typeof ipfs !== 'undefined') {}
	else {
		document.getElementById("ipfsprompt").innerHTML = `
			<h2>注意：</h2>
			<p style="color:red;">没有检测到ipfs节点，请安装ipfs伴侣，且通过https访问。</p>
		`
	}
	myContract = new localWeb3.eth.Contract(abi, address);
});


var file;
var fig;
var $file;
var $fig;
var fReader;
var buffer;
var hash;
document.getElementById("loadfig").addEventListener('input', function() {
	$fig = document.getElementById("loadfig");
	fReader = new FileReader();
	fReader.readAsArrayBuffer($fig.files[0]);
	fReader.onloadend = function(event){
		fig = event.target.result;
		var img = document.getElementById("image");
		setImg(fig, img);
		img.style.display = "block";
	};
}); 

document.getElementById("loadfile").addEventListener('input', function() {
	$file = document.getElementById("loadfile");
	fReader = new FileReader();
	fReader.readAsArrayBuffer($file.files[0]);
	var text = document.getElementById("uploadState");
	text.innerHTML = "文件上传中...";
	fReader.onloadend = function(event){
		file = event.target.result;
		text.innerHTML = "文件上传完成";
	};
}); 

document.getElementById("write1").onclick = function search() { 
	var username = document.getElementById("username1").value;
	var password = document.getElementById("password1").value;
	var name = document.getElementById("name1").value;
	var server = document.getElementById("server1");
	var data;

	// update file to ipfs through the server.
	if(server.checked) {	
		var formData = new FormData();
		data = JSON.stringify(Array.from(new Uint8Array(fig)));
		// console.log(data.substr(0, 5))
		formData.append('data', data);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				hash = data;
				writeData(username, password, name, data, "writeresult1");
			}
		};
		xhttp.open('POST', 'ipfs', true);
		xhttp.send(formData);

	// update to ipfs through local node.
	} else {
		ipfs.add(Buffer.from(fig), function(err, result) {
			
			hash = result[0].hash;
			data = hash;
			console.log(data);
			writeData(username, password, name, data, "writeresult1");
		});
	}
};

document.getElementById("write2").onclick = function search() { 
	var username = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var name = document.getElementById("name2").value;
	var server = document.getElementById("server1");
	var data;
	if(server.checked) {	
		var formData = new FormData();
		data = JSON.stringify(Array.from(new Uint8Array(file)));
		console.log(data);
		formData.append('data', data);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = this.responseText;
				console.log(data);
				hash = data;
				writeData(username, password, name, data, "writeresult2");
			}
		};
		xhttp.open('POST', 'ipfs', true);
		xhttp.send(formData);

	// update to ipfs through local node.
	} else {
		ipfs.add(Buffer.from(file), function(err, result) {
			hash = result[0].hash;
		});
		data = hash;
		writeData(username, password, name, data, "writeresult2");
	}
};

function writeData(userName, passwd, dataName, data, idName) {
	var userNameHash = localWeb3.utils.sha3(userName);
	var pk = localWeb3.utils.sha3(passwd);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);

	dataNameHash = localWeb3.utils.sha3(dataName);
	var signature = sign(dataNameHash.toString('hex'), pk);

	var text = document.getElementById(idName);
	text.innerHTML = "等待转账确认...";
	var server = document.getElementById("server2");

	if(server.checked){
		var formData = new FormData();
		formData.append('userName', userName);
		formData.append('userHash', userNameHash);
		formData.append('dataNameHash', dataNameHash);
		formData.append('dataName', dataName);
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
				    text.innerHTML = `
			        <p>数据写入成功。可进入一下网关查看：</p>
			        <a href="https://gateway.ipfs.io/ipfs/${hash}">ipfs.io</a>
			        <br/><br/>`
				}
			}
		};
		xhttp.open('POST', 'write', true);
		xhttp.send(formData);
	} else {
		myContract.methods.writePublicRecord(
			userNameHash, localWeb3.utils.sha3(dataName), data, signature.v, signature.r, signature.s)
		.send({from: account, gas: 1000000})
		.on('receipt', function(receipt){
		    text.innerHTML = `
	        <p>数据写入成功。可进入一下网关查看：</p>
	        <a href="https://gateway.ipfs.io/ipfs/${hash}">ipfs.io</a>
	        <br/><br/>`
		    })
		.on('error', function(error) {text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复...";});
	}
}

function setImg(buffer, img) {
	arrayBufferView = new Uint8Array(buffer);
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    img.src = imageUrl;
}