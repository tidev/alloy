migration.up = function(db) {
	db.createTable({
		"columns": {
			"name":"text",
			"nickname":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "fighters",
            "db": "fighters.sqlite"
		}
	});
};

migration.down = function(db) {
	db.dropTable("fighters");
};
