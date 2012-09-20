
migration.up = function(db) {
	db.createTable({
		"columns": {
			"book": "string",
			"author": "string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "books"
		}
	});	
};

migration.down = function(db) {
	db.dropTable("books");
};
