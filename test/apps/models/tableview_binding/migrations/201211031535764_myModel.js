migration.up = function(db) {
	db.createTable({
		"columns": {
			"title":"string",
			"image":"string",
			"timestamp":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "myModel"
		}
	});
};

migration.down = function(db) {
	db.dropTable("myModel");
};
