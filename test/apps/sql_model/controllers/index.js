$.table.updateContent = function(collection) {	
	var rows = [];
	for (var i = 0; i < collection.length; i++) {
		var m = collection[i].attributes, title = "";		
   		for(var key in m) { if (key !== "id") { title += m[key] + "  " }}	   			
		rows.push(Ti.UI.createTableViewRow({"title":title}));
	}	
	this.setData(rows);
};

// Now let's create a Backbone collection that will hold our models,
// the classes that represent our model have been generated automatically
// as Alloy components. Use new on the component to create the model or 
// collection.
var books = new (Alloy.getCollection('Book'));

// You can bind any Backbone event to models or collections but fetch is convenient because
// fetch occurs when the persistent store is sync'd to the local Backbone server.
books.bind("fetch", function() { $.table.updateContent(books.models); });

// Fetch will load models from persistent starage, sync'ing Backbone and persistent store.
books.fetch();

// Now we can add items to the model.
var book = new (Alloy.getModel('Book'))({book:"Jungle Book", author:"Kipling"});
books.add(book);

// Use Backbone shortcut to create a model and add to collection in single step. Does the same
// thing as the creating a new model and then adding it to the collection.
books.add({book:"War and Peace", author:"Tolstoy"});

// Add will add models to local Backbone server but save triggers the CRUD create opperation
// causing the model to get added to the persistent store. During create an id is added to the 
// model signaling that the model has been persisted and no longer in the new state.
books.forEach(function(model){ model.save();});

// UPDATE - update the model save here triggers the CRUD update opperation
book.save({author:"R Kipling"});

// Okay time to show the results. Remember this sync's local Backbone server with persitent store.
books.fetch();

// DELETE - destroy triggers the CRUD delete opperation
books.forEach(function(model) { model.destroy() }); 

$.index.open();

