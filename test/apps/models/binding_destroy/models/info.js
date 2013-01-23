exports.definition = {

	config: {
		"columns": {
			"name":"text",
			"email":"text",
			"twitter":"text"
		},
		"defaults": {
			"name":"Tony Lukasavage",
			"email":"tlukasavage@appcelerator.com",
			"twitter":"@tonylukasavage"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "info"
		}
	},

	extendModel: function(Model) {
		_.extend(Model.prototype, {

			// extended functions go here

		}); // end extend

		return Model;
	},


	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {

			// extended functions go here

		}); // end extend

		return Collection;
	}

}

