$.index.addEventListener('click', function() {
	$.popup.show({view: $.lbl});
});

function popupClick(e) {
	alert(e);
}

$.index.open();
