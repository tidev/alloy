migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"item":"text",
			"done":"integer",
			"date_completed":"date"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "todo"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("todo");
};
