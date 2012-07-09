var app = new $.App();

// TODO: Should we always do this? Could put it in the model code itself
// save all changes to Ti.App.Properties
app.on('change', function() { 
	app.save(); 
});

// Change label when 'count' changes on model
app.on('change:count', function(model) {
	$.label.text = 'count: ' + model.get('count');
});

// fetch model from Ti.App.Properties, or use defaults
app.fetch();

// increment model 'count' 
$.button.on('click', function() {
	app.set({'count':app.get('count')+1});
});

$.win.open();