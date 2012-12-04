
exports.definition = {
	config: {
		"columns": {
			"id": "String",
			"name": "String",
			"score": "Int"
		},
		"defaults": {
			"id": 0,
			"name": "<no name>",
			"score": 0
		},
		"adapter": {
			"type": "properties",
			"collection_name": "collection"
		}
	}
}