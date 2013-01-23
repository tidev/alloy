migration.up = function(migrator) {
	migrator.createTable({
		"columns": {
			"username":"text primary key",
			"realname":"text",
            "email":"text",
			"loggedIn":"integer",
            "loggedInSince":"text",
            "authKey":"text",
            "theme":"integer"
		}
	});
	migrator.insertRow({
		"username":"user",
		"realname":"Tobias Funke",
        "email":"tfunke@bluth.com",
		"loggedIn":0,
        "loggedInSince":"",
        "authKey":"",
        "theme":0
	});
};

migration.down = function(migrator) {
	migrator.dropTable("user");
};
