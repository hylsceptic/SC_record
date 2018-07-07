(function() {
	var table = window.document.getElementById('newData');
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

})();