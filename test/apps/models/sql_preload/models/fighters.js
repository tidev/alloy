exports.definition = {
	config: {
		"columns": {
			"name":"text",
			"nickname":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "fighters",
            "db": "fighters.sqlite"
		}
	}
}

