migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"title":"text",
			"image":"text",
			"timestamp":"text"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("myModel");
};
