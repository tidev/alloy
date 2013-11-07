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

	// silent option we'll use on Backbone functions to
	// prevent binding from firing
	var silent = { silent: true };

	// add model to the collection and save it to sqlite
	fighters.add(model, silent);

	// make this silent, since it will auto-add an id to
	// our model causing a "change" event
	model.save(null, silent);

	// let's refresh so we can see the ids coming from the
	// autoincrement field in the sqlite database in the
	// row click alerts
	fighters.fetch();
}

fighters.fetch();

$.index.open();