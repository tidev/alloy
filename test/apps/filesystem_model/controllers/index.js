
// function to keep a Ti.TableView in sync with Backbone CRUD operations
$.table.updateContent = function(o) {
	var rows = [];
	for (var i = 0; i < o.length; i++) {
		var m = o.models[i];
		
		title = "";
   		for(var key in m.attributes) { title += m.attributes[key] + "  "; }	
   			
		rows.push(Ti.UI.createTableViewRow({"title":title}));
	}	
	this.setData(rows);
};


// CRUD ops handler, typically put any special model processing here
var CRUDEops = {
	"create": function(o){ var models = []; o.length = 1; models[0] = o; o.models = models; o.set("id", guid()); $.table.updateContent(o); },
    "read": function(o){ $.table.updateContent(o); },
    "update": function(o){ var models = []; o.length = 1; models[0] = o; o.models = models; $.table.updateContent(o); },
    "delete": function(o){ /*$.table.updateContent(o);*/ }
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
var book = new $.Book({book:"Jungle Book", author:"Hemingway"});

// add to collection
books.add(book);

// use Backbone shortcut to create a model and add to collection in single step
books.add({book:"War and Peace", author:"Tolstoy"});

// add will add models to local server but save triggers the CRUD create opperation,
// if you look at the CRUD handler above you can see during create an id is added to flip the new state
books.forEach(function(model){model.save();});


// UPDATE - update the model save here triggers the CRUD update opperation
book.save({author:"Kipling"});


// READ - fetch triggers the CRUD read operation typically causes a sever to persistant store sync up,
// assigning a blank id set resets the new state so this fetch can show models in table
books.forEach(function(model){model.save({id:""});});
books.fetch();

// DELETE - destroy triggers the CRUD delete opperation
books.forEach(function(model){model.destroy();});


exports.open();

// utilities   
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};


