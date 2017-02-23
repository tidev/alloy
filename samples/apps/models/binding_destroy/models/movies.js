exports.definition = {

	config: {
		'columns': {
			'title':'text'
		},
		'adapter': {
			'type': 'sql',
			'collection_name': 'movies'
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

			// For Backbone v1.1.2, uncomment this to override the fetch method
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			},
			*/

		}); // end extend

		return Collection;
	}

};