migration.up = function(db) {
	db.createTable({
		"columns": {
			"title":"text",
			"subtitle":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "titles",
            "db": "mydb.sql"
		}
	});
};

migration.down = function(db) {
	db.dropTable("titles");
};
