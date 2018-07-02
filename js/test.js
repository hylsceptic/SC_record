var account;
var temp;
var temp1;
var localWeb3;
window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	  localWeb3 = new Web3(web3.currentProvider);
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
		console.log(12344);
		document.getElementById("ipfsprompt").innerHTML = `
			<h2>注意：</h2>
			<p style="color:red;">没有检测到ipfs节点，请安装ipfs伴侣，且通过https访问。</p>
		`
	}
	myContract = new localWeb3.eth.Contract(abi, address);
});


var file;
var $file;
var fReader;
var buffer;
var hash;
document.getElementById("loadfig").addEventListener('input', function() {
	$file = document.getElementById("loadfig");
	fReader = new FileReader();
	fReader.readAsArrayBuffer($file.files[0]);
	fReader.onloadend = function(event){
		file = event.target.result;
		var img = document.getElementById("image");
		setImg(file, img);
		img.style.display = "block";
		// ipfs.add(Buffer.from(file), function(err, result) {
		// 	hash = result[0].hash;
		// });
	    // var arrayBufferView;
	    // ipfs.add(Buffer.from(file), function(err, result) {
	    // 	hash = result[0].hash;
	    // 	ipfs.cat("/ipfs/" + hash, function(err, result) {
			  //   setImg(result, img);
			  //   img.style.display = "block";
	    // 	});
	    // });
	};
}); 

document.getElementById("loadfile").addEventListener('input', function() {
	$file = document.getElementById("loadfile");
	fReader = new FileReader();
	fReader.readAsArrayBuffer($file.files[0]);
	fReader.onloadend = function(event){
		file = event.target.result;
	};
}); 

document.getElementById("write1").onclick = function search() { 
	var username = document.getElementById("username1").value;
	var password = document.getElementById("password1").value;
	var name = document.getElementById("name1").value;
	var server = document.getElementById("server");
	var data;

	// update file to ipfs through the server.
	if(server.checked) {	
		var formData = new FormData();
		data = JSON.stringify(Array.from(new Uint8Array(file)));
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
		ipfs.add(Buffer.from(file), function(err, result) {
			hash = result[0].hash;
		});
		data = hash;
		console.log(data);
		writeData(username, password, name, data, "writeresult1");
	}
};

document.getElementById("write2").onclick = function search() { 
	var username = document.getElementById("username2").value;
	var password = document.getElementById("password2").value;
	var name = document.getElementById("name2").value;
	var data = hash;
	console.log(data);
	writeData(username, password, name, data, "writeresult2");
};

function writeData(userName, passwd, dataName, data, idName) {
	var userNameHash = localWeb3.utils.sha3(userName);
	var pk = localWeb3.utils.sha3(passwd);
	accounts = localWeb3.eth.accounts.privateKeyToAccount(pk);

	dataNameHash = localWeb3.utils.sha3(dataName);
	var signature = sign(dataNameHash.toString('hex'), pk);

	var text = document.getElementById(idName);
	text.innerHTML = "等待转账确认...";
	myContract.methods.writePublicRecord(
		userNameHash, localWeb3.utils.sha3(dataName), data, signature.v, signature.r, signature.s)
	.send({from: account, gas: 1000000})
	.on('receipt', function(receipt){
	    text.innerHTML = `
        <p>数据写入成功。可进入一下网关查看图片：</p>
        <a href="https://gateway.ipfs.io/ipfs/${hash}">ipfs.io</a>
        <br/><br/>`
	    })
	.on('error', function(error) {text.innerHTML = "数据写入失败，用户名、密码错误，或数据名重复...";});

}

function setImg(buffer, img) {
	arrayBufferView = new Uint8Array(buffer);
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    img.src = imageUrl;
}