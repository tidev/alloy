var app = new Alloy.Models.App; 

// TODO: Should we always do this? Could put it in the model code itself
// save all changes to Ti.App.Properties
app.on('change', function() { 
	app.save(); 
});

// Change label when 'count' changes on model
app.on('change:count', function(model) {
	$.label.text = 'model: ' + JSON.stringify(model.attributes);
});

// fetch model from Ti.App.Properties, or use defaults
app.fetch();

// event handlers 
$.create.on('click', function() {
	app.save(app.defaults);
});
$.destroy.on('click', function() {
	app.destroy();
});
$.increment.on('click', function() {
	app.set({'count':app.get('count')+1});
});

$.win.open();