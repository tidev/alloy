migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"title":"string",
			"text":"string",
			"mood":"string",
			"dateCreated":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "journal"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("journal");
};
