var ID = 'instance';
var app = Alloy.createModel('modelTab'); 

// Change label when 'count' changes on model
app.on('fetch change:count', function(model) {
	$.label.text = 'model: ' + JSON.stringify(app.attributes);
});

// fetch model from Ti.App.Properties adapter
app.set('id', ID);
app.fetch();

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function create(e) { 
	app.save(app.defaults); 
}

function destroy(e) { 
	app.destroy(); 
}

function increment(e) { 
	app.set({
		count: app.get('count')+1,
		id: ID
	}); 
	app.save();
}