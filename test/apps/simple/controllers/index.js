function showAlert() {
	alert("Click! Shouldn't do it again though");
	$.b.off("click",showAlert);
}
$.b.on("click",showAlert);

$.index.open();
