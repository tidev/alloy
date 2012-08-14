function showAlert() {
	alert("Click! Shouldn't do it again though");
	$.getView('b').off("click",showAlert);
}
$.getView('b').on("click",showAlert);
$.getView('index').open();
exports.someFunction();

exports.someFunction = function(args) {
	alert('stuff');
};
