var fighters = Alloy.Collections.fighters;
var counter = 1;

function showId(e) {
	if (e.row.model) {
		alert(e.row.model);
	}
}

function addTestFighter(e) {
	// create the test fighter model
	var model = Alloy.createModel('fighters', {
		name: 'Name ' + counter,
		nickname: 'Nickname ' + counter
	});
	counter++;

	// add model to the collection and save it to sqlite
	fighters.add(model);
	model.save();
}

fighters.fetch();

$.index.open();