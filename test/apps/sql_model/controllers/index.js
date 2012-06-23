// Function to keep a Ti.TableView in sync with Backbone CRUD opperations
$.table.updateContent = function(o) {	
	var rows = [];
	for (var i = 0; i < o.length; i++) {
		var m = o.models[i], title = "";		
   		for(var key in m.attributes) { title += m.attributes[key] + "  " }	   			
		rows.push(Ti.UI.createTableViewRow({"title":title}));
	}	
	this.setData(rows);
};

// CRUD ops handler, put any special model processing here, some are ignored for this sample
var CRUDEops = {
	"create": function(o) { Ti.API.info("create called with model="+JSON.stringify(o)); },
    "read": function(o) { $.table.updateContent(o); },
    "update": function(o) { Ti.API.info("update called with model="+JSON.stringify(o)); },
    "delete": function(o) { Ti.API.info("delete called with model="+JSON.stringify(o)); }
};

// listener for server to persistant store sync requests
$.BookCollection.notify.on('sync', function(e) {
	CRUDEops[e.method](e.model);	
});

// Now let's create a Backbone collection that will hold our models,
// the classes that represent our model have been generated automatically.
// Use new on the generated classes to create the model or collection object.
var books = new $.BookCollection;

// CREATE - create a model
var book = new $.Book({book:"Jungle Book", author:"Kipling"});

// Add a model to a Backbone collection.
books.add(book);

// Use Backbone shortcut to create a model and add to collection in single step.
books.add({book:"War and Peace", author:"Tolstoy"});

// READ - fetch triggers the CRUD read operation causing a sever to persistent store sync up.
// Fetch only returns models that are in the new state. 
books.fetch();

// Add will add models to local server but save triggers the CRUD create opperation,
// During create an id is added to the model signaling that the model has been persisted
// and no longer in the new state.
books.forEach(function(model){model.save();});

// UPDATE - update the model save here triggers the CRUD update opperation
book.save({author:"R Kipling"});

// DELETE - destroy triggers the CRUD delete opperation
books.forEach(function(model){model.destroy();});

$.main.open();

