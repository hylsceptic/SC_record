var account;
var temp;
var temp1;
var localWeb3;

window.addEventListener('load', init());


document.getElementById("read").onclick = function search() {
	var username = document.getElementById("username3").value;
	userNameHash = localWeb3.utils.sha3(username);
	var name = document.getElementById("name3").value;
	nameHash = localWeb3.utils.sha3(name);
	var text = document.getElementById("resultdata");
	myContract.methods.readPublicRecord(userNameHash, nameHash).call().then(
		function(data) {
		console.log(data);
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
	});
};

document.getElementById("comfirm").onclick = function search() {
	var comfirmer = document.getElementById("comfirmer").value;
	var comfirmerNameHash = localWeb3.utils.sha3(comfirmer);
	var drafter = document.getElementById("drafter").value;
	var drafterNameHash = localWeb3.utils.sha3(drafter);
	var dataName = document.getElementById("comfirm-dataName").value;
	var dataNameHash = localWeb3.utils.sha3(dataName);
	var text = document.getElementById("comfirmresult");
	
	myContract.methods.confirmations(comfirmerNameHash, drafterNameHash, dataNameHash).call().then(
		function(data) {
		if(data==false) {
			text.innerHTML = "确认人未确认此数据。";
		} else {
			text.innerHTML = "确认人已认此数据。";
		}
	});
};

document.getElementById("witness").onclick = function search() {
	var eyewitness = document.getElementById("eyewitness").value;
	var eyewitnessNameHash = localWeb3.utils.sha3(eyewitness);
	var drafter = document.getElementById("drafterofwitness").value;
	var drafterNameHash = localWeb3.utils.sha3(drafter);
	var dataName = document.getElementById("eyewitness-dataName").value;
	var dataNameHash = localWeb3.utils.sha3(dataName);
	var confirmer = document.getElementById("confirmerofwitness").value;
	var confirmerNameHash = localWeb3.utils.sha3(confirmer);
	var text = document.getElementById("witnessresult");

	myContract.methods.witnesses(eyewitnessNameHash, confirmerNameHash, drafterNameHash, 
		dataNameHash).call().then(
		function(data) {
		if(data==false) {
			text.innerHTML = "见证人未见证此数据。";
		} else {
			text.innerHTML = "见证人已见证此数据。";
		}
	});};

