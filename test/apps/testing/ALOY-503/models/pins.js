exports.definition = {
	config: {
		"columns" : {
			"title" : "text",
			"latitude": "real",
			"longitude": "real"
		},
		adapter: {
			type: "sql",
			collection_name: "pins"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};