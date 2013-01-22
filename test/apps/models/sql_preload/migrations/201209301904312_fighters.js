migration.up = function(migrator) {
	// nothing needed, all handled by the "db_file" property
	// in models/fighters.js
};

migration.down = function(migrator) {
	migrator.dropTable("fighters");
};
