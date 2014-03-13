var fighters = Alloy.Collections.fighters;
var counter = 1;

function showId(e) {
	if (e.row.model) {
		alert(e.row.model);
	}
}

function transformData(model) {
	var attrs = model.toJSON();
	Ti.API.info('attrs: ' + JSON.stringify(attrs));
	return attrs;
}

function addTestFighter(e) {
	// create the test fighter model
	var model = Alloy.createModel('fighters', {
		name: 'Name ' + counter,
		nickname: 'Nickname ' + counter
	});
	counter++;

	// add model to the collection and save it to sqlite, make
	// it silent so binding doesn't fire twice
	fighters.add(model, { silent: true });

	// this will save the model to storage, update it with
	// the automatically created id from the "server" (sqlite),
	// which will in turn trigger the UI update
	model.save();
}

fighters.fetch();

$.index.open();