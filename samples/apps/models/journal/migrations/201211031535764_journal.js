migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"title":"TEXT",
			"text":"TEXT",
			"mood":"TEXT",
			"dateCreated":"TEXT"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("journal");
};
