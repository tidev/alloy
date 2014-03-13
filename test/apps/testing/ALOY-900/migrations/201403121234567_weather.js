migration.up = function(migrator) {
	migrator.db.execute("CREATE TABLE IF NOT EXISTS weather (city TEXT, id INTEGER NOT NULL, bogusField TEXT);");
};

migration.down = function(db) {
	db.dropTable("weather");
};
