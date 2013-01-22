migration.up = function(migrator) {
	migrator.createTable({
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

migration.down = function(migrator) {
	migrator.dropTable("myModel");
};
