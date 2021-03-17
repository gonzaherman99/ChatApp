function addMyself() {
	var selectedName = document.getElementById("name").value;

	function setCookie(name, value) {
  		var date = new Date();
  		document.cookie = name + "=" + value + ";";
	}
	console.log(selectedName);
	setCookie("myself", selectedName, 1);
}