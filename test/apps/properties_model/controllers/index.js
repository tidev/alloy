var app = new (Alloy.getModel('App')); 

// TODO: Should we always do this? Could put it in the model code itself
// save all changes to Ti.App.Properties
app.on('change', function() { app.save(); });

// Change label when 'count' changes on model
app.on('change:count', function(model) {
	$.label.text = 'model: ' + JSON.stringify(model.attributes);
});

// fetch model from Ti.App.Properties adapter
app.fetch();

$.win.open();

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function create(e) { app.save(app.defaults); }
function destroy(e) { app.destroy(); }
function increment(e) { app.set({'count':app.get('count')+1}); }