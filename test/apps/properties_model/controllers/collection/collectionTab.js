var Alloy = require('alloy'),
	Backbone = Alloy.Backbone,
	_ = Alloy._,
	$;

var items = new (Alloy.getCollection('collectionTab')), 
	rowControllers = [];

function init(args) {
	$ = this;
}

function controller(args) {
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
	items.on('add destroy reset', function(model) { 
		resetTableData();
		if (model && model.save) { model.save(); }
	});

	// fetch collection from Ti.App.Properties adapter
	items.fetch();
}

//////////////////////////////////////
////////// private function //////////
//////////////////////////////////////
function resetTableData() {
	rowControllers = [];

	// create row controllers based on all models in the collection
	_.each(items.toJSON(), function(i) {
		rowControllers.push(new (Alloy.getController('collection/row'))({
			id: i.id,
			name: i.name,
			score: i.score
		}));
	});

	// fill table with the controllers' TableViewRow, and sort
	// by the row's ID
	$.table.setData(_.sortBy(
		_.map(rowControllers, function(r) { return r.getRoot(); }),
		function(r) { return r.id; }
	));
}

////////////////////////////////////
////////// event handlers //////////
//////////////////////////////////// 
function deleteItem(e) {
	var model = items.get(e.row.id);
	if (model) {
		model.destroy();
	}
}

function incrementScore(e) {
	var model = items.get(e.row.id);
	if (model) {
		model.set('score', model.get('score')+1);
	}
}

function addItem(e) {
	items.add(items.create({
		id: items.maxId++,
		name: $.text.value || '<no name>',
		score: 0
	}));
	$.text.value = '';
}
