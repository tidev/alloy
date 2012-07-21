/// Function to keep a Ti.TableView in sync with Backbone Model.
$.table.updateContent = function(collection) {	
	var rows = [];
	for (var i = 0; i < collection.length; i++) {
		var m = collection[i].attributes, title = "";		
   		for(var key in m) { if (key !== "id") { title += m[key] + "  " }}	   			
		rows.push(Ti.UI.createTableViewRow({"title":title}));
	}	
	this.setData(rows);
};

// CRUD ops handler, put any special model processing here, ignored for this sample
var CRUDops = {
	"create": function(o) { Ti.API.info("create called with model="+JSON.stringify(o)); },
    "read": function(o) { Ti.API.info("read called with model="+JSON.stringify(o)); },
    "update": function(o) { Ti.API.info("update called with model="+JSON.stringify(o)); },
    "delete": function(o) { Ti.API.info("delete called with model="+JSON.stringify(o)); }
};

// listener for server to persistant store sync requests
Alloy.getCollection('Book').notify.on('sync', function(e) {
	CRUDops[e.method](e.model);	
});

// Now let's create a Backbone collection that will hold our models,
// the classes that represent our model have been generated automatically.
// Use new on the generated classes to create the model or collection object.
var books = new (Alloy.getCollection('Book'));

// Fetch will load the models from persistent starage.
books.fetch();

// Now we can add items to the model.
var book = new (Alloy.getModel('Book'))({ book:"Jungle Book", author:"Kipling" });
books.add(book);

// Use Backbone shortcut to create a model and add to collection in single step. Does the same
// thing as the creating a new model and then addin it to the collection.
books.add({book:"War and Peace", author:"Tolstoy"});

// Add will add models to local server but save triggers the CRUD create opperation,
// During create an id is added to the model signaling that the model has been persisted
// and no longer in the new state.
books.forEach(function(model){model.save();});

// UPDATE - update the model save here triggers the CRUD update opperation
book.save({author:"R Kipling"});

// Okay time to show the results. Here you could filter the results if you only wanted to render a subset 
$.table.updateContent(books.models);

// DELETE - destroy triggers the CRUD delete opperation
//books.forEach(function(model){model.destroy({success: function(model, response) {}})}); // uncomment to remove store

$.index.open();