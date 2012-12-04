
exports.definition = {
	config: {
		"columns": {
			"id": "String",
			"count": "Int"
		},
		"defaults": {
			"id": "instance",
			"count": 0
		},
		"adapter": {
			"type": "properties",
			"collection_name": "singleModel"
		}
	}
}
