migration.up = function(db) {
	for (var i = 0; i < 5; i++) {
		db.insert({
			name: 'Migration ' + (i+1),
			nickname: 'nickname'
		});
	}
};

migration.down = function(db) {
	db.dropTable("fighters");
};
