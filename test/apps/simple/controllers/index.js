function showAlert() {
	alert("Click! Shouldn't do it again though");
	$.b.off("click",showAlert);
}
$.b.on("click",showAlert);
$.index.open();
exports.foo();

exports.foo = function() {
	exports.bar();
}
exports.bar = function() {
	alert($.b.title);
}
