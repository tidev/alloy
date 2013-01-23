var Alloy = require('alloy');

exports.addItem = function(collection) {
	// random title and image
	var random = Math.ceil(Math.random() * 12);
    var model = Alloy.createModel('MyModel', {
        title : 'title ' + random,
        image: '/' + random + '.png',
        timestamp: new Date().getTime()
    });
    
    // add new model to local collection
    collection.add(model);

	// save the model to persistent storage
    model.save();

	// reload the collection from persistent storage
    collection.fetch();
};

exports.removeItem = function(collection, index) {
	var model = collection.at(index);

	// remove the model from the collection
	collection.remove(model);

	// destroy the model from persistence
	model.destroy();

  	// update views from sql storage
  	collection.fetch();
};

exports.prepNavBar = function(window, callback) {
	var button = Ti.UI.createButton({
		title: 'add item'
	});
	button.addEventListener('click', callback);
	window.rightNavButton = button;
};

exports.comparator = function(model) {
	return model.get('timestamp');
};