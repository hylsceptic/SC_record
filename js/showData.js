(function() {
	var table = window.document.getElementById('newData');
	if(table != undefined) {
		var xhttp = new XMLHttpRequest();
		table.innerHTML = `<p>无法显示...</p>` ;
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = JSON.parse(this.responseText);

				// console.log(data);
				if(data=="error") {
					table.innerHTML = `<p>无法显示...</p>` ;
					// text.innerHTML = "数据确认失败...";
				} else {
					text = `
	          <tr>
	            <th style="width: 15%">用户名</th>
	            <th style="width: 15%">数据名</th> 
	            <th style="width: 70%">数据</th>
	          </tr>
	          `;
					for(i=0; i<data.length; i++) {
						item = data[i];
						text = text + `
				          <tr>
				            <th style="width: 15%">${item.name}</th>
				            <th style="width: 15%">${item.dataname}</th> 
				            <th style="width: 70%">${item.data}</th>
				          </tr>
				        `;
					}
					table.innerHTML = text;
				}
			}
		};
		xhttp.open('GET', 'newData', true);
		xhttp.send();
	}
   	var user;
   	var login;
    if('passwd' in window.localStorage) {
    	user = window.localStorage.getItem('userName');
    	login = "退出登录";

    	try {
    		$(".password").hide();
    		console.log(window.localStorage.getItem('passwd'));
    		$(".passwdVal").attr("value", window.localStorage.getItem('passwd'));
    	}
    	catch(err) {console.log(33123);};
    } else {
    	user = '用户信息';
    	login = '注册/登录';
    }
	var text = `
        <a href="index.html" class="Item">主页</a>
        <a href="account.html" class="Item">${user}</a>
        <a href="data.html" class="Item">存储数据</a>
        <a href="viewdata.html" class="Item">查看数据</a>
        <a href="visiter.html" class="Item">游客模式</a>
        <a href="test.html" class="Item">测试模块</a>
        <a href="login.html" class="Item">${login}</a>
        `;
	window.document.getElementById("Manu").innerHTML = text;
})();