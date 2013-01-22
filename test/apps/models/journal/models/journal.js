exports.definition = {
	config: {
		"columns": {
			"title":"TEXT",
			"text":"TEXT",
			"mood":"TEXT",
			"dateCreated":"TEXT"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "journal"
		}
	}
}

