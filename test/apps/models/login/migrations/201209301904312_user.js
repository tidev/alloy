migration.up = function(db) {
	db.createTable({
		"columns": {
			"username":"text",
			"realname":"text",
            "email":"text",
			"loggedIn":"integer",
            "loggedInSince":"text",
            "authKey":"text",
            "theme":"integer"
		},
		"defaults": {
			"realname":"Tobias Funke",
            "email":"tfunke@bluth.com",
			"theme":0
		},
		"adapter": {
			"type": "sql",
			"collection_name": "user"
		}
	});
};

migration.down = function(db) {
	db.dropTable("user");
};
