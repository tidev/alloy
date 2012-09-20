function showAlert(e) {
	alert('$.' + e.source.id + ' says hello! Just this once though.');
	$.b.off("click",showAlert);
}
$.index.open();
