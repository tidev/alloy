migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			name: 'TEXT',
			nickname: 'TEXT',
			fighterId: 'TEXT'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("fighters");
};
