var items = Alloy.createCollection('collectionTab'),
	rowControllers = [];

// update the row and save the model when the score changes
items.on('change:score', function(model) {
	if (model) {
		var row = _.find(rowControllers, function(r) {
			return r.id === model.id;
		});
		if (row) {
			row.score.text = model.get('score');
			model.save();
		}
	}
});

// reset the table whenever a model is added or destroyed
// completely. Also reset whenever the collection is reset.
// Save the model changes if necessary.
items.on('fetch', function(model) {
	resetTableData();
});

// fetch collection from Ti.App.Properties adapter
items.fetch();

//////////////////////////////////////
////////// private function //////////
//////////////////////////////////////
function resetTableData() {
	rowControllers = [];

	// create row controllers based on all models in the collection
	_.each(items.toJSON(), function(i) {
		rowControllers.push(Alloy.createController('collection/row', {
			id: i.id,
			name: i.name,
			score: i.score
		}));
	});

	// fill table with the controllers' TableViewRow, and sort
	// by the row's ID
	var theArray = _.sortBy(rowControllers, function(r) {
		return r.getView('name').text;
	});
	$.table.setData(_.map(theArray, function(r) {return r.getView();}));
}

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function deleteItem(e) {
	var model = items.get(e.row.id);
	if (model) {
		model.destroy();
	}
	items.fetch();
}

function incrementScore(e) {
	var model = items.get(e.row.id);
	if (model) {
		model.set('score', model.get('score')+1);
	}
}

function addItem(e) {
	var model = items.create({
		name: $.text.value || '<no name>',
		score: 0
	});
	items.add(model);
	items.fetch();
	$.text.value = '';
}
