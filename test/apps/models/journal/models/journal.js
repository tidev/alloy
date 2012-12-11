exports.definition = {
	config: {
		"columns": {
			"title":"string",
			"text":"string",
			"mood":"string",
			"dateCreated":"string"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "journal"
		}
	}
}

