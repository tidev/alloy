exports.definition = {
	config: {
		"columns": {
			"name":"text",
			"nickname":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "fighters",

			// The pre-loaded sqlite DB with which we'd like to
			// initialize our database.
            "db_file": "fighters.sqlite",

            // db_name is only really necessary if we use a pre-loaded 
            // sqlite database and then remove it later. Explicitly
            // specifying the database name let's Alloy know in which 
            // file it can find your database. This value should be the 
            // same as the name of your pre-loaded db.
            "db_name": "fighters"
		}
	}
}

