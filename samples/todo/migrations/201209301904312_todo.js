migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"item":"text",
			"done":"integer",
			"date_completed":"text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("todo");
};
