migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"name":"string",
			"email":"string",
			"twitter":"string"
		},
		"defaults": {
			"name":"Tony Lukasavage",
			"email":"tlukasavage@appcelerator.com",
			"twitter":"@tonylukasavage"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "info"
		}
	});
};

migration.down = function(migrator) {
	migrator.dropTable("info");
};
