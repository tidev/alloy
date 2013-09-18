var names = Alloy.Collections.name;

function green(str) { return '\x1B[32m' + str + '\x1B[39m'; }
function red(str) { return '\x1B[31m' + str + '\x1B[39m'; }

// show the info from the selected model
function showInfo(e) {
	// get the model id from the list item
	var modelId = e.section.getItemAt(e.itemIndex).properties.modelId;

	// fetch a specific model based on the given id
	var model = Alloy.createModel('info');
	model.fetch({ id: modelId });

	// assert we got the right data back
	var pass = JSON.stringify(model.attributes) === JSON.stringify({
		id: modelId,
		info: 'info ' + modelId
	});
	Ti.API.info('Assert single info model returned with "{id:' + modelId + '}": ' + (pass ? green('OK') : red('FAIL')));
}

// fetch the data to update the UI
names.fetch();

// open the window
$.index.open();