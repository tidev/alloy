migration.up = function(migrator) {
	migrator.createTable({
		columns: {
			name: 'TEXT',
			nickname: 'TEXT',
			fighterId: 'TEXT PRIMARY KEY'
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable('fighters');
};
