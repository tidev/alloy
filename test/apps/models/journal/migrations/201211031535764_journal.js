migration.up = function(db) {
	db.createTable({
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

migration.down = function(db) {
	db.dropTable("journal");
};
