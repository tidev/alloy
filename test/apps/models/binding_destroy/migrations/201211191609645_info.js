migration.up = function(db) {
	db.createTable({
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

migration.down = function(db) {
	db.dropTable("info");
};
