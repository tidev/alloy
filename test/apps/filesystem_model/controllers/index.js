

$.BookCollection.notify.on('refresh', function(e) {
	if (e.method === "read") {
		var rows = [];
		for (var i = 0; i < e.model.length; i++) {
			var m = e.model.models[i];
			var title =  m.attributes.book + " - " + m.attributes.author;
			rows.push(Ti.UI.createTableViewRow({"title":title}));
		}	
		$.table.setData(rows);
	}
});

var books = new $.BookCollection;

books.add({"book":"War and Peace", author:"Tolstoy"});
books.add({"book":"Light in August", author:"Faulkner"});

// create the models in the collection
books.forEach(function(model){model.save();});

// read the models in the collection
books.fetch();

// for this sample delete models to clean up
books.forEach(function(model){model.destroy();});

exports.open();