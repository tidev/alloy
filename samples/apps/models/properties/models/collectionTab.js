exports.definition = {
	config: {
		'columns': {
			'name': 'String',
			'score': 'Int'
		},
		'defaults': {
			'name': '<no name>',
			'score': 0
		},
		'adapter': {
			'type': 'properties',
			'collection_name': 'collection'
		}
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
		});
		return Collection;
	}
};