exports.definition = {
	config: {
		"columns" : {
			"city" : "text",
			"id": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "cities",
			db_file: "/weather.sqlite",
			idAttribute: "id"
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