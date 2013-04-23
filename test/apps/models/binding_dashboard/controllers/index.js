var icons = Alloy.Collections.icons;
var isEditable = false;

function resetBadge(e) {
	// TODO: https://jira.appcelerator.org/browse/ALOY-500
	//
	// NOTE: Ti.UI.DashboardView collection binding should be 
	// considered unstable until the above ticket and its TIMOB
	// dependecies are resolved.
	// 
	// Can't use collection binding effectively with Ti.UI.DashboardView
	// due to an error in setData() that causes all DashboardItems to 
	// be appended rather than reseting the items. This is logged in
	// TIMOB-12606 and the code commented below will be implemented
	// once that ticket has been resolved. Until then only simple 
	// interaction will work as any additional data binding events fired 
	// will cause all the items to be appended again.
	// 
	// tl;dr Don't use Ti.UI.DashboardView collection binding until
	//       TIMOB-12606 and ALOY-500 are resolved.

	// var model = icons.get(e.item.modelId);
	// if (model) {
	// 	model.set('badge', 0);
	// 	model.save();
	// } else {
	// 	TI.API.error('No corresponding model found for DashboardItem in resetBadge()');
	// }
	
	e.item.badge = 0;
}

function toggleEditMode(e) {
	isEditable ? $.dash.stopEditing() : $.dash.startEditing();
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

icons.fetch();

$.index.open();