function showAlert(e) {
	alert('$.' + e.source.id + ' says hello! Just this once though.');
	$.b.removeEventListener("click",showAlert);
}
$.index.open();
