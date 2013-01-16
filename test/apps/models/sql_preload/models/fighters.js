exports.definition = {
	config: {
		"columns": {
			"name":"text",
			"nickname":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "fighters",

			// tells model to use myapp.sqlite file to install 
			// database and to use "myapp" as the database name
			// for all further operations
			"db_file": "/myapp.sqlite"
		}
	}
}