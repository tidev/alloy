migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"name":"text",
			"email":"text",
			"twitter":"text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("info");
};
