exports.definition = {
	config: {
		"columns": {
			"name":"text",
			"nickname":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "fighters",

			// db_file tells model to use myapp.sqlite file to install 
			// database and to use "myapp" as the database name for
			// all further operations
			"db_file": "/myapp.sqlite",

			// idAttribute tells Alloy/Backbone to use this column in
			// my table as its unique identifier field. Without 
			// specifying this, Alloy's default behavior is to create
			// and "alloy_id" field which will uniquely identify your
			// rows in the table.
			"idAttribute": "id" 
		}
	}
}