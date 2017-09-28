var isEditable = false;

function resetBadge(e) {
	e.item.badge = 0;
}

function toggleEditMode(e) {
	if (isEditable) {
		$.dash.stopEditing();
	} else {
		$.dash.startEditing();
	}
}

function handleEdit(e) {
	$.editButton.title = 'Done';
	$.editButton.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
	isEditable = true;
}

function handleCommit(e) {
	$.editButton.title = 'Edit';
	$.editButton.style = Ti.UI.iPhone.SystemButtonStyle.PLAIN;
	isEditable = false;
}

$.index.open();