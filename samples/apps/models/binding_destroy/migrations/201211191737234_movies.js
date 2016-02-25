migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"title":"text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("movies");
};
