migration.up = function(db) {
	for (var i = 0; i < 5; i++) {
		db.insertRow({
			name: 'Migration ' + (i+1),
			nickname: 'nickname'
		});
	}
};

migration.down = function(db) {
	db.dropTable("fighters");
};
