var myself;

function getCookie(name) {
	var array = document.cookie;
	var indices = [];
	for (var i = 0; i <= array.length; i++) {
		if (array[i] === ";") {
			indices.push(i);
		} else {
			console.log("nothing");
		}
	}

	var myselfResults = sliceArray(array, 3, indices);
	var usersResults = sliceArray(array, 2, indices);
	var portsResults = sliceArray(array, 1, indices);
	

	var pushtoArray = intoArray(portsResults);
	var pushtoArray2 = intoArray(usersResults);
	var pushtoArray3 = intoArray(myselfResults);


	myself = pushtoArray3;
	/*console.log(pushtoArray2);
	console.log(pushtoArray);*/

	var showConnected = Array.from(pushtoArray2);
	showsConnected(showConnected, pushtoArray, myself);
}

function sliceArray(element, num, index) {
	if (num < 2) {
		return decodeURIComponent(element.slice(index[0] + 1, index[1]));
	} 	else if (num > 2) {
		return decodeURIComponent(element.slice(0, index[0]));	
	}	else {
		return decodeURIComponent(element.slice(index[1] + 1, element.lenght));
	}
}

function intoArray(element) {
	var character = element.indexOf(":");
	var getArray;
	if (character != -1) {
		getArray = element.split(":");
	} else {
		getArray = element.split("=");
	}
	if (getArray[0] === "users=j") {
		getArray.shift();
	} else if (getArray[0] === "myself") {
		getArray.shift();
	}
	return getArray;
}

function showsConnected(array, port, me) {
	if (port[0] === " ports=j") {
		port.shift();
	}
	var parsedPortArray = JSON.parse(port);
	var willShow = array.slice(1, 5);
	var parsedArray = JSON.parse(willShow);
	var form = document.getElementById("form");
	var buttons;
	var name;
	var textnode;
	var dot;
	var arryNames = [];
	console.log(typeof parsedArray[0]);
	console.log(typeof me[0]);
	for (var i = 0; i <= parsedArray.length; i++) {
		//creation of the button
		if (parsedArray[i] === me[0]) {
			console.log("found myself");
		} else  if (parsedArray[i] !== me[0] ){
			buttons = document.createElement("button");
			buttons.name = parsedPortArray[i];
			buttons.type = "submit";
			buttons.className = "box";

			//creation of the name title
			name = document.createElement("h2");

			//creation of the text
			var text = parsedArray[i].toString().toUpperCase();
			textnode = document.createTextNode(text);

			//cration of the connected dot
			var divDot = document.createElement("div");
			divDot.className = "connected";

			var finalName = name.appendChild(textnode);
			buttons.appendChild(finalName);
			buttons.appendChild(divDot);
			form.appendChild(buttons);
		} else {
			console.log("escaped");
		}
	}	
}

function addMyself() {
	var selectedName = document.getElementById("name").value;

	function setCookie(cname, cvalue, exdays) {
  		var d = new Date();
  		d.setTime(d.getTime() + (exdays*24*60*60*1000));
  		var expires = "expires="+ d.toUTCString();
  		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	setCookie("myself", selectedName, 1);
}


getCookie("users");
