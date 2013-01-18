migration.up = function(db) {
	db.createTable({
		"columns": {
			"title":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "movies"
		}
	});
};

migration.down = function(db) {
	db.dropTable("movies");
};
