var icons = Alloy.Collections.icons;
var isEditable = false;

function resetBadge(e) {
	var model = icons.get(e.item.modelId);
	if (model) {
		model.set('badge', 0);
		model.save();
	} else {
		TI.API.error('No corresponding model found for DashboardItem in resetBadge()');
	}
}

function toggleEditMode(e) {
	if (isEditable) {
		$.dash.stopEditing();
	} else {
		$.dash.startEditing();
	}
}

function handleEdit(e) {
	// edit is fired when you enter edit mode
	$.editButton.title = 'Done';
	$.editButton.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
	isEditable = true;
}

function handleCommit(e) {
	// commit is fired when you exit edit mode
	Ti.API.info('Commit: ' + JSON.stringify(e));
	$.editButton.title = 'Edit';
	$.editButton.style = Ti.UI.iPhone.SystemButtonStyle.PLAIN;
	isEditable = false;
	// rearrange the items by setting their weights equal to their new order in the data e.source.array
	var itemsArray = e.source.data;
	for (var i = 0, j = itemsArray.length; i < j; i++) {
		var model = icons.get(itemsArray[i].modelId);
		if (model) {
			model.set('weight', i);
			model.save();
		} else {
			TI.API.error('No corresponding model found for DashboardItem in resetBadge()');
		}
	}
	// have to re-fetch to show the new order without having to fully-quit the app
	icons.fetch();
}

function handleDelete(e) {
	// This event fires on item clicks and other times it should not, see https://jira.appcelerator.org/browse/TIMOB-13649
	Ti.API.info('Delete item: ' + e.item.label);
}

icons.fetch();

$.index.open();