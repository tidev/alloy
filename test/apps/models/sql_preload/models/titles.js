exports.definition = {
	config: {
		"columns": {
			"title":"text",
			"subtitle":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "titles",
            "db": "mydb.sql"
		}
	}
}

