exports.definition = {
	config: {
		"columns": {
			"item":"text",
			"done":"integer",
			"date_completed":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "todo"
		}
	}
};
