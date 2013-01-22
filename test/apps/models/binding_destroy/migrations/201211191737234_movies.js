migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"title":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "movies"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("movies");
};
