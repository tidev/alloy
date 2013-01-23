exports.definition = {

	config: {
		"columns": {
			"title":"text"
		},
		"adapter": {
			"type": "sql",
			"collection_name": "movies"
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

