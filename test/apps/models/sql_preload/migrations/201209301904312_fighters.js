migration.up = function(db) {
	// nothing needed, all handled by the "db_file" property 
	// in models/fighters.js
};

migration.down = function(db) {
	db.dropTable("fighters");
};
